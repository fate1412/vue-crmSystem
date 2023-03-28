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
import myElSelect from '@/components/Table/my-el-select'
import { getMainListByPage, approve, getOptions } from '@/api/table'
import { isPermission } from '@/utils/validate'

export default {
  name: 'sysFlow',
  components: { filterPane, tablePane, myElSelect },
  data() {
    return {
      tableName: 'sysFlowSession',
      dialogVisible: false,
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '流程数据',
            width: 230,
            key: 'dataId'
          }
        ]
      },
      from: [],
      // 表格配置
      dataSource: {
        tool: [],
        data: [], // 表格数据
        cols: [
          {
            label: '任务id',
            // width: 100,
            prop: 'id'
          },
          {
            label: '流程id',
            // width: 100,
            prop: 'flowId'
          },
          {
            label: '所属业务',
            // width: 100,
            prop: 'tableNameR',
            link: true,
            noClick: true
          },
          {
            label: '流程数据',
            prop: 'dataId',
            // width: 230
          },
          {
            label: '审批状态',
            prop: 'passR',
            // width: 230
          },
          {
            label: '提交人',
            prop: 'createrR',
            link: true,
            click: this.getDetails
          },
          {
            label: '下一审批人',
            prop: 'nextApproverR',
            link: true,
            click: this.getDetails
          }
        ], // 表格的列数据
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
          width: '150', // 根据实际情况给宽度
          data: [ // 功能数组
            {
              label: '同意', // 操作名称
              type: 'primary', //为element btn属性则是按钮
              handleRow: this.agree,
              hasPermission: isPermission('Customer_Edit', this.$store.state.user)
            },
            {
              label: '拒绝', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              handleRow: this.denial,
              hasPermission: isPermission('Customer_Edit', this.$store.state.user)
            }
          ]
        }
      },
      msg: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.dataSource.loading = true
      const pageData = this.dataSource.pageData
      const msg = this.msg
      let data = {
        'page': pageData.pageNum,
        'pageSize': pageData.pageSize,
        'like': {
          'dataId': msg.dataId
        }
      }
      getMainListByPage(this.tableName, data).then(res => {
        this.dataSource.loading = false
        if (res.success) {
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
    agree(index, row, label) {
      this.approve(row,1)
    },
    denial(index, row, label) {
      this.approve(row,2)
    },
    approve(data, pass) {
      data.pass = pass
      let msg = pass === 1 ? '已同意' : '已拒绝'
      approve(data).then(res => {
        this.$message({
          type: 'info',
          message: msg
        });
        this.getList()
      })
    },
    cancelPoint(flowPoint,index) {
      this.flowPoints.splice(index, 1)
    },
    getOptions(query, page, tableName) {
      let params = {
        "nameLike": query,
        "page": page,
        "tableName": tableName
      }
      return getOptions(params).then(res => {
        return Promise.resolve(res.data)
      })
    },
  }
}
</script>

<style scoped lang='scss'>

</style>
