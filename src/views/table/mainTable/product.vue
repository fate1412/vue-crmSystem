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

import { getMainListByPage, deleteMainTable } from '@/api/table'

export default {
  name: 'product',
  components: { filterPane, tablePane },
  data() {
    return {
      tableName: 'product',
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '产品Id',
            width: 230,
            key: 'id'
          },
          {
            name: '产品名称',
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
          handleClick: this.createTable,
          show: isPermission("Product_Insert",this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '产品Id',
            // width: 100,
            prop: 'id',
            link: true
          },
          {
            label: '产品名称',
            // width: 100,
            prop: 'name'
          },
          {
            label: '产品单价/元',
            // width: 100,
            prop: 'price'
          },
          {
            label: '产品库存/件',
            prop: 'stock',
            // width: 230
          },
          {
            label: '真实库存/件',
            prop: 'realStock',
            // width: 230
          },
          {
            label: '销售量/件',
            prop: 'salesVolume',
            // width: 230
          },
          {
            label: '是否上架',
            prop: 'isShelf',
            // width: 230
          },
          {
            label: '上架时间',
            prop: 'onShelfTime',
            // width: 230
          },
          {
            label: '下架时间',
            prop: 'offShelfTime',
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
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              show: isPermission("Product_Delete",this.$store.state.user),
              handleRow: this.deleteTable
            }
          ]
        }
      },
      msg: {}
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
      const msg = this.msg
      let data = {
        'page':  pageData.pageNum,
        'pageSize': pageData.pageSize,
        'like' : {
          'id': msg.id,
          'name': msg.name,
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
          isEdit: isPermission((toUpperCase(this.tableName)+'_Edit'),this.$store.state.user)
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
