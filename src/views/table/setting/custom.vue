<template>
  <div class="app-container" style="display: flex;">
    <div style="width: 50%">
      <filter-pane :filter-data="table.filterData" @filterMsg="tableFilterMsg"/>
      <table-pane
        :data-source="table.dataSource"
        :rowClick="getColumnList"
      />
    </div>

    <div v-if="showColumns" style="width: 50%">
      <filter-pane :filter-data="column.filterData" @filterMsg="columnFilterMsg"/>
      <table-pane
        :data-source="column.dataSource"
      />
    </div>
    <el-drawer
      :title="detail.title"
      :visible.sync="drawer"
      direction="rtl"
      size="80%"
    >
      <my-form
        :status="detail.status"
        :tableName="detail.tableName"
        :id="detail.id"
        :goBack="FormGoBack"
        :submit="saveData"
      />

    </el-drawer>
  </div>
</template>

<script>
import filterPane from '@/components/Table/filterPane'
import tablePane from '@/components/Table/tablePane'
import myElSelect from '@/components/Table/my-el-select'
import myForm from '@/components/Table/form'

import { getMainListByPage, deleteMainTable, addMainTable } from '@/api/table'
import { isPermission, toUpperCase } from '@/utils/validate'


export default {
  name: "custom",
  components: { filterPane, tablePane, myElSelect, myForm },
  data() {
    return {
      drawer: false,
      showColumns: false,
      table: {
        tableName: 'tableDict',
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
            show: isPermission("TableDict_Insert", this.$store.state.user),
            bgColor: ''//自定义按钮背景色
          }],
          data: [], // 表格数据
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
                hasPermission: isPermission('TableDict_Delete', this.$store.state.user),
                show: function (index, row, label) {
                  return row.custom
                }
              }
            ]
          }
        }
      },
      column: {
        tableName: 'columns',
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
            handleClick: this.createColumn,
            show: isPermission("Columns_Edit", this.$store.state.user),
            bgColor: ''//自定义按钮背景色
          }],
          data: [], // 表格数据
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
                hasPermission: isPermission('Columns_Edit', this.$store.state.user),
                show: function (index, row, label) {
                  if (row.custom) {
                    return true;
                  } else {
                    return (row.columnType === 1 && !row.link) && !row.disabled
                  }
                }
              },
              {
                label: '删除', // 操作名称
                type: 'danger', //为element btn属性则是按钮
                handleRow: this.deleteColumn,
                hasPermission: isPermission('Columns_Edit', this.$store.state.user),
                show: function (index, row, label) {
                  return row.custom
                }
              }
            ]
          }
        }
      },
      tableMsg: {},
      columnMsg: {},
      thisTable: {},
      detail: {
        status: {
          disabled: true,
          edit: false,
          create: false,
          //权限
          isDelete: false,
          isEdit: false,
          hasCustom: true
        },
        tableName: '',
        id: '',
        title: ''
      },
      useSubmit: true,

    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      const tableName = this.table.tableName
      const msg = this.tableMsg
      let data = {
        'like': {
          'showName': msg.showName
        }
      }
      getMainListByPage(tableName, data).then(res => {
        if (res.success) {
          this.table.dataSource.data = res.data.tableDataList
        }
      })
    },
    getColumnList(row) {
      this.showColumns = true
      const tableName = this.column.tableName
      this.thisTable = row
      const msg = this.columnMsg
      let data = {
        'like': {
          'tableName': row.tableName,
          'showName': msg.showName
        }
      }
      getMainListByPage(tableName, data).then(res => {
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
      this.getColumnList(this.thisTable)
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
    createTable() {
      this.useSubmit = false
      const tableName = this.table.tableName
      this.detail.tableName = tableName
      this.detail.id = 0
      this.detail.title = '新建表'
      this.detail.status.create = true
      this.detail.status.disabled = false
      this.detail.status.isDelete = isPermission((toUpperCase(tableName) + '_Delete'), this.$store.state.user)
      this.detail.status.isEdit = isPermission((toUpperCase(tableName) + '_Edit'), this.$store.state.user)
      this.drawer = true;
    },
    createColumn() {
      this.useSubmit = true
      const tableName = this.column.tableName
      this.detail.tableName = tableName
      this.detail.id = 0
      this.detail.title = '新建字段'
      this.detail.status.create = true
      this.detail.status.disabled = false
      this.detail.status.isDelete = isPermission((toUpperCase(tableName) + '_Delete'), this.$store.state.user)
      this.detail.status.isEdit = isPermission((toUpperCase(tableName) + '_Edit'), this.$store.state.user)
      this.drawer = true;
    },
    columnEdit(index, row, label) {
      this.useSubmit = false
      const tableName = this.column.tableName
      this.drawer = true;
      this.detail.tableName = tableName
      this.detail.id = row.id
      this.detail.title = row.showName
      this.detail.status.create = false
      this.detail.status.disabled = true
      this.detail.status.hasCustom = row.custom
      this.detail.status.isDelete = isPermission((toUpperCase(tableName) + '_Delete'), this.$store.state.user)
      this.detail.status.isEdit = isPermission((toUpperCase(tableName) + '_Edit'), this.$store.state.user)
    },
    deleteTable(index, row, label) {
      this.open('此操作将永久删除该, 是否继续?', () => {
        let data = {
          'id': row.id
        }
        return deleteMainTable(this.table.tableName, data).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getList();
          this.showColumns = false
          this.thisTable = {}
        });
      });
    },
    deleteColumn(index, row, label) {
      this.open('此操作将永久删除该, 是否继续?', () => {
        let data = {
          'id': row.id
        }
        return deleteMainTable(this.column.tableName, data).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
          this.getColumnList(this.thisTable);
        });
      });
    },
    FormGoBack() {
      this.drawer = false;
      this.getTableList()
      if (this.thisTable.tableName !== undefined && this.thisTable.tableName !== null) {
        this.getColumnList(this.thisTable)
      }
    },
    saveData(data) {
      if (!this.useSubmit) {
        return false;
      } else {
        if (data === undefined) {
          return false
        }
        data.tableName = this.thisTable.tableName
        addMainTable(this.column.tableName, data).then(response => {
          this.$message('新增成功！')
          this.listLoading = false
          this.drawer = false;
          this.getColumnList(this.thisTable)
        })
        return true;
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
