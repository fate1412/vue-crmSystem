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

import { getMainListByPage, deleteMainTable, invoice } from '@/api/table'

export default {
  name: 'invoice',
  components: { filterPane, tablePane },
  data() {
    return {
      tableName: 'invoice',
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '发货单Id',
            width: 230,
            key: 'id'
          },
          {
            name: '销售订单id',
            width: 230,
            key: 'salesOrderId'
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
          show: isPermission('Invoice_Insert',this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '发货单Id',
            // width: 100,
            prop: 'id',
            link: true
          },
          {
            label: '销售订单id',
            // width: 100,
            prop: 'salesOrderIdR',
            link: true,
            click: this.getDetails
          },
          {
            label: '客户名称',
            prop: 'customerIdR',
            link: true,
            click: this.getDetails
            // width: 230
          },
          {
            label: '计划发货日期',
            prop: 'planInvoiceDate',
            // width: 230
          },
          {
            label: '发货日期',
            prop: 'invoiceDate',
            // width: 230
          },
          {
            label: '是否发货',
            prop: 'isInvoice'
          },
          {
            label: '物流单号',
            prop: 'logisticsId'
          },
          {
            label: '收货日期',
            prop: 'receiptTime'
          },
          {
            label: '收货地址',
            prop: 'address'
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
              label: '发货确认', // 操作名称
              type: 'primary', //为element btn属性则是按钮
              hasPermission: isPermission('Invoice_Edit',this.$store.state.user),
              handleRow: this.invoice,
              show: function (index, row, label) {
                return !row.isInvoice
              }
            },
            {
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              hasPermission: isPermission('Invoice_Delete',this.$store.state.user),
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
        'page':  pageData.pageNum,
        'pageSize': pageData.pageSize,
        'like' : {
          'id': msg.id,
          'salesOrderId': msg.salesOrderId
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
          isDelete: isPermission((toUpperCase(this.tableName)+'_Delete'),this.$store.state.user),
          isEdit: isPermission((toUpperCase(this.tableName)+'_Edit'),this.$store.state.user),
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
    deleteTable(index,row,label) {
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
    invoice(index,row,label) {
      this.open('此操作不可逆, 是否确定完成发货?', () => {
        let data = {
          'id': row.id
        }
        console.log("aaaaaaaaaaaaaaaaaa")
        console.log(row.id)
        return invoice(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '已确定完成发货！'
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
