<template>
  <div class="app-container">
    <filter-pane :filter-data="filterData" @filterMsg="filterMsg"/>
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    />
  </div>
</template>

<script>
import filterPane from '@/components/Table/filterPane'
import tablePane from '@/components/Table/tablePane'
import { getMainListByPage } from '@/api/table'

export default {
  name: 'customer',
  components: { filterPane, tablePane },
  data() {
    return {
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '客户ID',
            width: 230,
            key: 'id'
          },
          {
            name: '客户名称',
            width: 230,
            key: 'name'
          }
        ]
      },
      form: {},
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增',
          key: 1,
          permission: 2010701,
          handleClick: this.createTable,
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '客户ID',
            // width: 100,
            prop: 'id',
            link: true
          },
          {
            label: '客户名称',
            // width: 100,
            prop: 'name'
          },
          {
            label: '客户类型',
            // width: 100,
            prop: 'customerTypeR'
          },
          {
            label: '手机号',
            prop: 'mobile',
            // width: 230
          },
          {
            label: '创建时间',
            prop: 'createTime',
            // width: 230
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            // width: 230
          },
          {
            label: '创建人',
            prop: 'createrR',
            link: true,
            click: this.getDetails
          },
          {
            label: '修改人',
            prop: 'updateMemberR',
            link: true,
            click: this.getDetails
          },
          {
            label: '负责人',
            prop: 'ownerR',
            link: true,
            click: this.getDetails
          }
        ], // 表格的列数据
        handleSelectionChange: () => {
        },
        border: true,
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        isIndex: false, // 列表序号
        loading: true, // loading
        pageData: {
          total: 0, // 总条数
          pageSize: 10, // 每页数量
          pageNum: 1 // 页码
        },
        operation: {
          // 表格有操作列时设置
          label: '操作', // 列名
          width: '100', // 根据实际情况给宽度
          data: [ // 功能数组
            {
              type: 'icon', //为icon则是图标
              label: '推荐', // 功能
              icon: 'iconfont recommend-btn icon-iconkuozhan_tuijianpre',
              permission: '3010105', // 后期这个操作的权限，用来控制权限
              handleRow: this.handleRow
            },
            {
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.handleRow
            }
          ]
        }
      },
      dialogAdd: true,
      msg: {}
    }
  },
  watch: {
    $route: {
      handler: 'resetData'
    }
  },
  created() {
    console.log("table")
    this.getList()
  },
  methods: {
    getList() {
      this.dataSource.loading = true
      const pageData = this.dataSource.pageData
      const tableName = 'customer'
      getMainListByPage(tableName, pageData.pageNum, pageData.pageSize).then(res => {
        this.dataSource.loading = false
        if (res.success) {
          if (res.data.total > 0) {
            // this.dataSource.cols = res.data.tableColumns
            this.dataSource.pageData.total = res.data.total
            this.dataSource.data = res.data.tableDataList
          } else {
            // this.dataSource.cols = res.data.tableColumns
            this.dataSource.data = []
            this.dataSource.pageData.total = 0
          }
        }
      })
    },
    filterMsg(msg) {
      this.msg = msg
      this.getList()
    },
    changeSize(size) {
      this.dataSource.pageData.pageSize = size
      this.getList()
    },
    changeNum(pageNum) {
      this.dataSource.pageData.pageNum = pageNum
      this.getList()
    },
    resetData() {
      //在这里获取并处理该路由下所需要的数据。
      this.getList();
    },
    createTable() {
      this.$router.push({
        name: 'Form',
        params: {
          goBackName: this.$route.name,
          tableName: this.$route.name,
          disabled: false
        }
      })
    },
    deleteTable() {

    }
  }
}
</script>

<style scoped lang='scss'>

</style>
