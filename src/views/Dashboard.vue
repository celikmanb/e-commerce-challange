<template>
  <div>
    <v-container>
      <div style="display: flex">
        <chart-box
          :dataSeries="dataSeries"
          :xAxis="xAxis"
          @sendItem="checkClickControl"
        />
        <v-select
          :items="dates"
          v-model="selectedDate"
          label="Select Date"
        ></v-select>
      </div>
      <div v-show="showDataTable">
        <v-data-table
          :headers="headers"
          :items="currentDataItems"
          :items-per-page="itemPerPage"
          :page.sync="currentPage"
          :options="paginationOptions"
          hide-default-footer
          class="elevation-1"
        ></v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
          ></v-pagination>
        </div>
      </div>
    </v-container>
    <popup-box 
      :visible="snackbar.visible"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ChartBox from "../components/ChartBox.vue";
import PopupBox from '../components/PopupBox.vue';

export default {
  name: "Dashboard",
  components: {
    ChartBox,
    PopupBox
  },
  data() {
    return {
      dataList: [],
      dataSeries: [
        {
          name: "profit",
          data: [],
        },
        {
          name: "fbaAmount",
          data: [],
        },
        {
          name: "fbmAmount",
          data: [],
        },
      ],
      xAxis: [],
      headers: [
        { text: "SKU", value: "sku" },
        { text: "Product Name", value: "productName" },
        { text: "Avg. Selling Price", value: "amount" },
        { text: "SKU Refund Rate", value: "refundRate" },
      ],
      dataItems: [],
      itemPerPage: 10,
      page: 1,
      dailySkuList: null,
      skuRateList: null,
      dates: [
        { text: "Last 60 Day", value: 60 },
        { text: "Last 30 Day", value: 30 },
        { text: "Last 14 Day", value: 14 },
        { text: "Last 7 Day", value: 7 },
      ],
      selectedDate: { text: "Last 7 Day", value: 7 },
      showDataTable: false,
      pageCount: 12,
      clickedItems: [],
      currentPage: 1,
      paginationOptions: {},
      snackbar: {
        visible: false,
        message: "",
        color: ""
      }
    };
  },
  computed: {
    getMarketplaceName() {
      return (
        this.$store.state.userInfo?.user?.store[0]?.marketplaceName ||
        JSON.parse(localStorage.getItem("userInfo"))?.user?.store[0]
          ?.marketplaceName
      );
    },
    getSellerId() {
      return (
        this.$store.state.userInfo?.user?.store[0]?.storeId ||
        JSON.parse(localStorage.getItem("userInfo"))?.user?.store[0]?.storeId
      );
    },
    currentDataItems() {
      const startIndex = (this.currentPage - 1) * this.itemPerPage;
      const endIndex = startIndex + this.itemPerPage;
      return this.dataItems.slice(startIndex, endIndex);
    },
  },
  watch: {
    currentPage(val) {
      if (val != 1) {
        this.getItemDetails();
      }
    },
    selectedDate() {
      this.getChartData();
    },
  },
  methods: {
    ...mapActions([
      "fetchDailySalesOverview",
      "fetchDailySalesSkuList",
      "fetchGetSkuRefundRate",
    ]),
    checkClickControl(val) {
      if (this.clickedItems.length == 0) {
        this.clickedItems.push(val?.point?.category);
        this.getItemDetails();
      } else if (this.clickedItems.length == 1) {
        if (this.clickedItems[0] == val?.point?.category) {
          this.setSnackbarPopup(true, "Same column selected", "error")
        }else {
          this.clickedItems.push(val?.point?.category); 
          this.getItemDetails();
        }
      } else {
        let isNewItem = this.clickedItems.find((item) => item == val?.point?.category);
        if (!isNewItem) {
          this.clickedItems[0] = this.clickedItems[1];
          this.clickedItems[1] = val?.point?.category;
          this.getItemDetails();
        }
      }
    },
    async getItemDetails() {
      let fillIndex = (this.currentPage - 1) * this.itemPerPage;
      let params = {
        marketplace: this.getMarketplaceName,
        sellerId: this.getSellerId,
        salesDate: this.clickedItems[0],
        salesDate2:
          this.clickedItems.length == 2
            ? this.clickedItems[1]
            : "",
        pageSize: 10,
        pageNumber: this.currentPage,
        isDaysCompare: this.clickedItems.length == 1 ? 0 : 1, // 0 one col 1 two col
      };
      this.dailySkuList = await this.fetchDailySalesSkuList(params);
      if (
        this.dailySkuList?.item?.skuList &&
        this.dailySkuList?.item?.skuList.length > 0
      ) {
        let rateParams = {
          marketplace: this.getMarketplaceName,
          sellerId: this.getSellerId,
          skuList: this.dailySkuList?.item?.skuList,
          requestedDay: 0,
        };
        this.skuRateList = await this.fetchGetSkuRefundRate(rateParams);
        if (!this.skuRateList || this.skuRateList.length == 0) {
          this.setSnackbarPopup(true, "SKU Rate Not Found!", "error")
          return
        }else {
          this.showDataTable = true;
          let emptyData = {
            sku: "",
            productName: "",
            amount: "",
            refundRate: "",
          };
  
          this.dataItems = new Array(fillIndex).fill(emptyData, 0, fillIndex);
          this.dataItems = this.dataItems.concat(
            this.skuRateList.map((item) => {
              if (this.clickedItems.length == 2) {
                return { ...item, ...item.sku, amount: item?.sku?.amount +"/"+ item?.sku?.amount2 }; 
              }
              return { ...item, ...item.sku }; 
            })
          );
        }
      } else {
        this.setSnackbarPopup(true, "SKU List Not Found!", "error")
      }
    },
    async getChartData() {
      let params = {
        customDateData: null,
        day: this.selectedDate.value,
        excludeYoYData: true,
        marketplace: this.getMarketplaceName || "", //marketplaceName
        requestStatus: 0,
        sellerId: this.getSellerId || "", //storeId
      };
      let dailyData = await this.fetchDailySalesOverview(params);
      if (!dailyData || !dailyData.item || dailyData.item.length == 0) {
        this.setSnackbarPopup(true, "Daily Sales Not Found!", "error")
      }else {
        this.dataList = dailyData?.item?.map((el) => {
          return {
            date: el.date,
            fbaAmount: el.fbaAmount,
            fbaShippingAmount: el.fbaShippingAmount,
            fbmAmount: el.fbmAmount,
            profit: el.profit,
            totalSales: el.fbaAmount + el.fbmAmount,
          };
        });
        this.dataList.forEach((element) => {
          this.dataSeries[0].data.push(element.profit);
          this.dataSeries[1].data.push(element.fbaAmount);
          this.dataSeries[2].data.push(element.fbmAmount);
          this.xAxis.push(element.date);
        });
      }
    },
    setSnackbarPopup(visible, message, color) {
      this.snackbar = {visible: visible, message: message, color: color}
    }
  },
  mounted() {
    this.getChartData();
  },
};
</script>

<style>
</style>