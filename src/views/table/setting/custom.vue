<template>
  <div class="app-container" style="display: flex;">
    <div style="width: 50%">
      <filter-pane :filter-data="table.filterData" @filterMsg="tableFilterMsg"/>
      <table-pane
        :data-source="table.dataSource"
        :rowClick="getColumnList"
      />
    </div>
    <el-divider direction="vertical"></el-divider>
    <div style="width: 50%">
      <filter-pane :filter-data="column.filterData" @filterMsg="columnFilterMsg"/>
      <table-pane
        :data-source="column.dataSource"
      />
    </div>
  </div>
</template>

<script>
import filterPane from '@/components/Table/filterPane'
import tablePane from '@/components/Table/tablePane'
import myElSelect from '@/components/Table/my-el-select'

import { getMainListByPage, deleteMainTable, getOptions, getRoles, updateRoles, resetPasswd } from '@/api/table'
import { isPermission, toUpperCase } from '@/utils/validate'


export default {
  name: "custom",
  components: { filterPane, tablePane, myElSelect },
  data() {
    return {
      table: {
        // 搜索栏配置
        filterData: {
          timeSelect: false,
          elinput: [
            {
              name: '表名',
              width: 230,
              key: 'showName'
            }
          ]
        },
        permissions: [],
        // 表格配置
        dataSource: {
          tool: [{
            name: '新增',
            key: 1,
            handleClick: this.createTable,
            show: true,
            // show: isPermission("SysRole_Insert",this.$store.state.user),
            bgColor: ''//自定义按钮背景色
          }],
          data: [
            {
              'name': 1
            }
          ], // 表格数据
          cols: [
            {
              label: '表名',
              // width: 100,
              prop: 'showName'
            },
            {
              label: 'tableName',
              // width: 100,
              prop: 'tableName'
            }
          ], // 表格的列数据
          handleSelectionChange: () => {
          },
          border: true,
          isSelection: false, // 表格有多选时设置
          isOperation: true, // 表格有操作列时设置
          isIndex: false, // 列表序号
          loading: false, // loading
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
                label: '删除', // 操作名称
                type: 'danger', //为element btn属性则是按钮
                handleRow: this.deleteTable,
                show: true
                // show: isPermission('SysRole_Delete',this.$store.state.user)
              }
            ]
          }
        }
      },
      column: {
        // 搜索栏配置
        filterData: {
          timeSelect: false,
          elinput: [
            {
              name: '字段名',
              width: 230,
              key: 'showName'
            }
          ]
        },
        permissions: [],
        // 表格配置
        dataSource: {
          tool: [{
            name: '新增',
            key: 1,
            handleClick: this.createTable,
            show: true,
            // show: isPermission("SysRole_Insert",this.$store.state.user),
            bgColor: ''//自定义按钮背景色
          }],
          data: [
            {
              'name': 1
            }
          ], // 表格数据
          cols: [
            {
              label: '字段名',
              // width: 100,
              prop: 'showName'
            },
            {
              label: 'columnName',
              // width: 100,
              prop: 'columnName'
            },
            {
              label: '数据类型',
              // width: 100,
              prop: 'columnTypeR'
            }
          ], // 表格的列数据
          handleSelectionChange: () => {
          },
          border: true,
          isSelection: false, // 表格有多选时设置
          isOperation: true, // 表格有操作列时设置
          isIndex: false, // 列表序号
          loading: false, // loading
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
                label: '编辑', // 操作名称
                type: 'primary', //为element btn属性则是按钮
                handleRow: this.columnEdit,
                show: true
                // show: isPermission('SysRole_Delete',this.$store.state.user)
              },
              {
                label: '删除', // 操作名称
                type: 'danger', //为element btn属性则是按钮
                handleRow: this.deleteTable,
                show: true
                // show: isPermission('SysRole_Delete',this.$store.state.user)
              }
            ]
          }
        }
      },
      tableMsg: {},
      columnMsg: {},
      thisTable: ''
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      const msg = this.tableMsg
      let data = {
        'like' : {
          'showName': msg.showName
        }
      }
      getMainListByPage('tableDict', data).then(res => {
        if (res.success) {
          this.table.dataSource.data = res.data.tableDataList
        }
      })
    },
    getColumnList(row) {
      const msg = this.columnMsg
      let data = {
        'like' : {
          'tableName': row.tableName,
          'showName': msg.showName
        }
      }
      getMainListByPage('tableColumnDict', data).then(res => {
        if (res.success) {
          this.column.dataSource.data = res.data.tableDataList
        }
      })
    },
    tableFilterMsg(msg) {
      this.tableMsg = msg
      this.getTableList()
    },
    columnFilterMsg(msg) {
      this.columnMsg = msg
      // this.getList()
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
    columnEdit(index, row, label) {
      const tableName = 'tableColumnDict'
      this.$router.push({
        name: 'Form',
        params: {
          goBackName: this.$route.name,
          tableName: tableName,
          tableId: row.id,
          create: false,
          isDelete: isPermission((toUpperCase(tableName)+'_Delete'),this.$store.state.user),
          isEdit: isPermission((toUpperCase(tableName)+'_Edit'),this.$store.state.user)
        }
      })
    },
    deleteTable(index, row, label) {
      this.open('此操作将永久删除该, 是否继续?', () => {
        let data = {
          'userId': row.userId
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
  }
}
</script>

<style scoped>

</style>
