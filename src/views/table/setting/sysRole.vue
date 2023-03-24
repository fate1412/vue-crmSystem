<template>
  <div class="app-container">
    <filter-pane :filter-data="filterData" @filterMsg="filterMsg"/>
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    />
    <el-dialog
      title="权限修改"
      :visible.sync="dialogVisible"
      width="30%">
      <span>
        <el-form ref="form" label-width="100px"
                 label-position="right">
          <el-form-item v-for="(permission,index) in permissions" :key="index" :label="'权限'+(index+1)">
            <my-el-select v-model="permission.permissionId" placeholder="输入权限名称" ref="" :initialName="permission.permissionDesc"
              :doSelectList="getPermissionsOptions" tableName="sysRole"/>
            <el-button type="danger" @click="cancelPermission(permission,index)" style="margin-left: 10px" >删 除</el-button>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPermission">添 加</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermissions">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filterPane from '@/components/Table/filterPane'
import tablePane from '@/components/Table/tablePane'
import myElSelect from '@/components/Table/my-el-select'
import { isPermission, toUpperCase } from '@/utils/validate'

import { getMainListByPage, deleteMainTable, getOptions, getPermissions, updatePermissions, getPermissionsOptions } from '@/api/table'

export default {
  name: 'sysRole',
  components: { filterPane, tablePane, myElSelect },
  data() {
    return {
      tableName: 'sysRole',
      dialogVisible: false,
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '角色Id',
            width: 230,
            key: 'roleId'
          },
          {
            name: '角色名称',
            width: 230,
            key: 'roleName'
          }
        ]
      },
      form: {},
      permissions: [],
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增',
          key: 1,
          handleClick: this.createTable,
          show: isPermission("SysRole_Insert",this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '角色Id',
            // width: 100,
            prop: 'roleId',
            link: true
          },
          {
            label: '角色名称',
            // width: 100,
            prop: 'roleName'
          },
          {
            label: '角色Code',
            // width: 100,
            prop: 'roleCode'
          },
          {
            label: '描述',
            prop: 'roleDesc',
            // width: 230
          },
          {
            label: '创建时间',
            prop: 'createTime',
            // width: 230
          },
          {
            label: '修改时间',
            prop: 'updateTime',
            // width: 230
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
          width: '150', // 根据实际情况给宽度
          data: [ // 功能数组
            {
              label: '权限', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              handleRow: this.setPermission,
              hasPermission: isPermission('SysRolePermission_Edit',this.$store.state.user)
            },
            {
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              handleRow: this.deleteTable,
              hasPermission: isPermission('SysRole_Delete',this.$store.state.user)
            }
          ]
        }
      },
      thisRoleId: '',
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
          'roleId': msg.roleId,
          'roleName': msg.roleName
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
    deleteTable(index, row, label) {
      console.log(row)
      this.open('此操作将永久删除该, 是否继续?', () => {
        let data = {
          'roleId': row.roleId
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
    setPermission(index, row, label) {
      this.dialogVisible = true;
      this.thisRoleId = row.roleId;
      getPermissions(row.roleId).then(res => {
        this.permissions = res.data || []
      })

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
    getPermissionsOptions(query, page) {
      let params = {
        "nameLike": query,
        "page": page
      }
      return getPermissionsOptions(params).then(res => {
        return Promise.resolve(res.data)
      })
    },
    addPermission() {
      this.permissions.push({
        permissionId: '',
        permissionCode: '',
        permissionDesc: ''
      })
    },
    updatePermissions() {
      updatePermissions(this.thisRoleId,this.permissions).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功！'
        });
        this.dialogVisible = false;
        this.thisRoleId = '';
        this.permissions = []
      })
    },
    cancelPermission(role, index) {
      this.permissions.splice(index, 1)
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
