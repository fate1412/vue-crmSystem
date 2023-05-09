<template>
  <div class="app-container">
    <filter-pane :filter-data="filterData" @filterMsg="filterMsg"/>
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    />

    <el-dialog
      :title="thisFlow.name+'  流程设置'"
      :visible.sync="dialogVisible"
      width="35%">

      <el-timeline>
        <div style="display: flex;">
          <div style="margin-top: 15px">
            <el-timeline-item
              v-for="(flowPoint, index) in flowPoints" :key="index"
              style="width: 120px; height: 60px">
              {{ "审批节点"+(index+1) }}
            </el-timeline-item>
          </div>
          <div>
            <div v-for="(flowPoint, index) in flowPoints" :key="index" style="margin-bottom: 20px">
              审批人：
              <my-el-select v-model="flowPoint.approver" placeholder="输入审批人名称" ref="" :initialName="flowPoint.approverR"
                            :doSelectList="getOptions" tableName="sysUser"/>
              <el-button type="danger" @click="cancelPoint(flowPoint,index)" style="margin-left: 10px" >删 除</el-button>
            </div>
          </div>
        </div>

      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPoint">添 加</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePoints">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import filterPane from '@/components/Table/filterPane'
import tablePane from '@/components/Table/tablePane'
import myElSelect from '@/components/Table/my-el-select'
import { getMainListByPage, deleteMainTable, getOptions, getFlowPoints, updateFlowPoints } from '@/api/table'
import { isPermission, toUpperCase } from '@/utils/validate'

export default {
  name: 'sysFlow',
  components: { filterPane, tablePane, myElSelect },
  data() {
    return {
      tableName: 'sysFlow',
      dialogVisible: false,
      // 搜索栏配置
      filterData: {
        timeSelect: false,
        elinput: [
          {
            name: '流程ID',
            width: 230,
            key: 'id'
          },
          {
            name: '流程名称',
            width: 230,
            key: 'name'
          }
        ]
      },
      flowPoints: [],
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增',
          key: 1,
          handleClick: this.createTable,
          show: isPermission('SysFlow_Insert', this.$store.state.user),
          bgColor: ''//自定义按钮背景色
        }],
        data: [], // 表格数据
        cols: [
          {
            label: '流程ID',
            // width: 100,
            prop: 'id',
            link: true
          },
          {
            label: '流程名称',
            // width: 100,
            prop: 'name'
          },
          {
            label: '关联表',
            // width: 100,
            prop: 'relevanceTableR',
            link: true,
            noClick: true
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
              label: '编辑流程', // 操作名称
              type: 'primary', //为element btn属性则是按钮
              handleRow: this.openPoint,
              hasPermission: isPermission('SysFlow_Edit', this.$store.state.user)
            },
            {
              label: '删除', // 操作名称
              type: 'danger', //为element btn属性则是按钮
              handleRow: this.deleteTable,
              hasPermission: isPermission('SysFlow_Delete', this.$store.state.user)
            }
          ]
        }
      },
      thisFlow: {},
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
          'name': msg.name
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
          isEdit: isPermission((toUpperCase(this.tableName) + '_Edit'), this.$store.state.user)
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
    openPoint(index, row, label) {
      this.dialogVisible = true
      this.thisFlow = row
      getFlowPoints(row.id).then(res => {
        this.flowPoints = res.data || []
      })
    },
    cancelPoint(flowPoint,index) {
      this.flowPoints.splice(index, 1)
    },
    addPoint() {
      this.flowPoints.push({
        approver: '',
        approverR: ''
      })
    },
    updatePoints() {
      let data = {
        'flowId': this.thisFlow.id,
        'flowPoints': this.flowPoints
      }
      for(let i=0; i< this.flowPoints.length; i++) {
        data.flowPoints[i].flowId = this.thisFlow.id
        data.flowPoints[i].panelPoint = i+1
      }
      updateFlowPoints(data).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功！'
        });
        this.dialogVisible = false;
        this.thisFlow = {};
        this.flowPoints = []
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
  }
}
</script>

<style scoped lang='scss'>

</style>
