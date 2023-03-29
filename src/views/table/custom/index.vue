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
import { isPermission, toUpperCase } from '@/utils/validate'

// import { getMainListByPage, deleteMainTable } from '@/api/table'
import { getCustomListByPage, deleteMainTable } from '@/api/customTable'

export default {
  name: 'customTable',
  components: { filterPane, tablePane },
  data() {
    return {
      tableName: '',
      dialogVisible: true,
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '销售订单Id',
            width: 230,
            key: 'id'
          },
          {
            name: '客户Id',
            width: 230,
            key: 'customerId'
          }
        ]
      },
      form: {},
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增',
          key: 1,
          handleClick: this.createTable,
          show: isPermission("Custom_Insert",this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [], // 表格的列数据
        handleSelectionChange: () => {
        },
        border: true,
        isSelection: false, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        isIndex: true, // 列表序号
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
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              hasPermission: isPermission("Custom_Delete",this.$store.state.user),
              handleRow: this.deleteTable
            }
          ]
        }
      },
      msg: {}
    }
  },
  watch: {
    $route: {
      handler() {
        this.tableName = this.$route.name
        this.getList()
      },
      deep: true
    }
  },
  created() {
    this.tableName = this.$route.name
    this.getList()
  },
  methods: {
    getList() {
      this.dataSource.loading = true
      const pageData = this.dataSource.pageData
      const msg = this.msg
      let data = {
        'page':  pageData.pageNum,
        'pageSize': pageData.pageSize,
        'like' : {
          'id': msg.id,
          'customerId': msg.customerId,
        },
        'tableName': this.tableName
      }
      getCustomListByPage(data).then(res => {
        this.dataSource.loading = false
        if (res.success) {
          this.dataSource.cols = res.data.tableColumns
          if (res.data.total > 0) {
            this.dataSource.pageData.total = res.data.total
            this.dataSource.data = res.data.tableDataList
          } else {
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
    createTable() {
      this.$router.push({
        name: 'Form',
        params: {
          goBackName: this.tableName,
          tableName: this.tableName,
          disabled: false,
          isDelete: isPermission('Custom_Delete',this.$store.state.user),
          isEdit: isPermission('Custom_Edit',this.$store.state.user),
          isInsert: isPermission('Custom_Edit',this.$store.state.user),
          isCustom: true
        }
      })
    },
    open(message, operation) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operation();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    deleteTable(index,row,label) {
      this.open('此操作将永久删除该, 是否继续?', () => {
        let data = {
          'id': row.id
        }
        return deleteMainTable(this.tableName, data).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList();
        });
      });
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
