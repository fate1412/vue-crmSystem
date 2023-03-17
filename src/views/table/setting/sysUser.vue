<template>
  <div class="app-container">
    <filter-pane :filter-data="filterData" @filterMsg="filterMsg"/>
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    />
    <el-dialog
      title="角色修改"
      :visible.sync="dialogVisible"
      width="30%">
      <span>
        <el-form ref="form" label-width="100px"
                 label-position="right">
          <el-form-item v-for="(role,index) in roles" :key="index" :label="'角色'+(index+1)">
            <my-el-select v-model="role.roleId" placeholder="输入角色名称" ref="" :initialName="role.roleName"
              :doSelectList="getOptions" tableName="sysRole"/>
            <el-button type="danger" @click="cancelRole(role,index)" style="margin-left: 10px" >删 除</el-button>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">添 加</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoles">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filterPane from '@/components/Table/filterPane'
import tablePane from '@/components/Table/tablePane'
import myElSelect from '@/components/Table/my-el-select'

import { getMainListByPage, deleteMainTable, getOptions, getRoles, updateRoles } from '@/api/table'
import { isPermission } from '@/utils/validate'

export default {
  name: 'sysUser',
  components: { filterPane, tablePane, myElSelect },
  data() {
    return {
      tableName: 'sysUser',
      dialogVisible: false,
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '用户ID',
            width: 230,
            key: 'userId'
          },
          {
            name: '用户名',
            width: 230,
            key: 'username'
          }
        ]
      },
      form: {},
      roles: [],
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增',
          key: 1,
          handleClick: this.createTable,
          show: isPermission('SysUser_Insert',this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '用户ID',
            // width: 100,
            prop: 'userId',
            link: true
          },
          {
            label: '用户名',
            // width: 100,
            prop: 'username'
          },
          {
            label: '用户姓名',
            // width: 100,
            prop: 'realName'
          },
          {
            label: '手机号',
            prop: 'phone',
            // width: 230
          },
          {
            label: '最后登录时间',
            prop: 'lastLoginTime',
            // width: 230
          },
          {
            label: '是否锁定',
            prop: 'lockFlag',
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
              show: isPermission('SysUserRole_Edit',this.$store.state.user),
              handleRow: this.setRole
            },
            {
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              show: isPermission('SysUser_Delete',this.$store.state.user),
              handleRow: this.deleteTable
            }
          ]
        }
      },
      thisUserId: '',
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
      getMainListByPage(this.tableName, pageData.pageNum, pageData.pageSize).then(res => {
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
          disabled: false
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
    setRole(index, row, label) {
      this.dialogVisible = true;
      this.thisUserId = row.userId;
      getRoles(row.userId).then(res => {
        this.roles = res.data || []
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
    addRole() {
      this.roles.push({
        roleId: '',
        roleName: ''
      })
    },
    updateRoles() {
      updateRoles(this.thisUserId,this.roles).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功！'
        });
        this.dialogVisible = false;
        this.thisUserId = '';
        this.roles = []
      })
    },
    cancelRole(role,index) {
      this.roles.splice(index, 1)
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
