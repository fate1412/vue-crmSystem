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

import { getMainListByPage, deleteMainTable, stockUp } from '@/api/table'

export default {
  name: 'stockList',
  components: { filterPane, tablePane },
  data() {
    return {
      tableName: 'stockList',
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '备货单Id',
            width: 230,
            key: 'id'
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
          show: isPermission("StockList_Insert", this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '备货单Id',
            // width: 100,
            prop: 'id',
            link: true
          },
          {
            label: '备货日期',
            // width: 100,
            prop: 'stockUpDate'
          },
          {
            label: '总价/元',
            // width: 100,
            prop: 'prices'
          },
          {
            label: '是否完成备货',
            prop: 'isStockUp',
            // width: 230
          },
          {
            label: '是否完成受理',
            prop: 'isAcceptance',
            // width: 230
          },
          {
            label: '是否紧急',
            prop: 'isPressing',
            setColor: function (isPressing) {
              if (isPressing) {
                return 'red'
              } else {
                return 'lightgreen'
              }
            }
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
            prop: 'updaterR',
            link: true,
            click: this.getDetails
          },
          {
            label: '负责人',
            prop: 'ownerR',
            link: true,
            click: this.getDetails
          },
          {
            label: '是否通过',
            prop: 'pass',
            pass: true
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
          width: '140', // 根据实际情况给宽度
          data: [ // 功能数组
            {
              label: '备货确认', // 操作名称
              type: 'primary', //为element btn属性则是按钮
              hasPermission: isPermission('StockList_Edit',this.$store.state.user),
              handleRow: this.stockUp,
              show: function (index, row, label) {
                return !row.isStockUp
              }
            },
            {
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              hasPermission: isPermission("StockList_Delete", this.$store.state.user),
              handleRow: this.deleteTable
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
          'id': msg.id,
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
    createTable() {
      this.$router.push({
        name: 'Form',
        params: {
          goBackName: this.tableName,
          tableName: this.tableName,
          disabled: false,
          isDelete: isPermission((toUpperCase(this.tableName) + '_Delete'), this.$store.state.user),
          isEdit: isPermission((toUpperCase(this.tableName) + '_Edit'), this.$store.state.user),
          isInsert: isPermission((toUpperCase(this.tableName)+'_Insert'),this.$store.state.user)
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
    deleteTable(index, row, label) {
      this.open('此操作将永久删除, 是否继续?', () => {
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
    },
    stockUp(index, row, label) {
      this.open('此操作不可逆, 是否确认完成备货?', () => {
        return stockUp(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '确认成功！'
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
