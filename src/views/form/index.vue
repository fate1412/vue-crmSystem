<template>
  <div class="app-container">
    <div style="margin-bottom: 20px; float: left">
      <el-button @click="goBack">返回</el-button>
    </div>
    <div style="display: flex;justify-content: right;margin-bottom: 20px">
      <el-button type="primary" @click="saveTable">{{ create || edit ? '提交' : '编辑' }}</el-button>
      <el-button @click="cancelTable">{{ create || edit ? '取消' : '删除' }}</el-button>
    </div>

    <el-form v-loading="listLoading" ref="form" :inline="true" :model="form" label-width="100px" label-position="right">
      <el-form-item v-for="(column,index) in tableColumns" :key="index" :label="column.label"
                    v-if="isShow(column.inserted)"
                    style="width: 49%; min-width: 300px">
        <!--        下拉选择框-->

        <el-select v-if="column.formType==='Select' && !column.link" v-model="form[column.prop]" :label="column.label"
                   :disabled="(!create && column.disabled ) || disabled" placeholder="">

          <el-option v-for="item in column.options" :key="item.optionKey" :label="item.option" :value="item.optionKey"/>

        </el-select>

        <my-el-select v-else-if="column.formType==='Select' && column.link" v-model="form[column.prop]"
                      :disabled="(!create && column.disabled ) || disabled" placeholder=""
                      :doSelectList="getOptions" :tableName="form[column.prop + 'R'].tableName"
        />

        <!--        时间-->
        <div v-else-if="column.formType==='Date' || column.formType==='DateTime'" style="width: 200%">
          <el-col style="width: 41%">
            <el-date-picker type="date" placeholder="选择日期" v-model="form[column.prop]"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :disabled="(!create && column.disabled ) || disabled" style="width: 100%;"></el-date-picker>
          </el-col>
          <div v-if="column.formType==='DateTime'">
            <el-col class="line" :span="2">-</el-col>
            <el-col style="width: 40%">
              <el-time-picker placeholder="选择时间" v-model="form[column.prop]" value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="(!create && column.disabled ) || disabled" style="width: 100%;"></el-time-picker>
            </el-col>
          </div>
        </div>
        <!--        Input-->
        <el-input v-if="column.formType==='Input'" v-model="form[column.prop]"
                  :disabled="(!create && column.disabled ) || disabled"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import myElSelect from '@/components/Table/my-el-select'

import { getOptions, getMainTableById, updateMainTable, addMainTable, deleteMainTable, getColumns } from '@/api/table'

export default {
  components: {
    myElSelect
  },
  data() {
    return {
      listLoading: true,
      goBackName: "",
      tableName: "",
      id: "",
      form: {},
      tableColumns: [],
      disabled: true,
      edit: false,
      create: true
    }
  },
  created() {
    const params = this.$route.params
    this.create = params.create === undefined ? true : params.create
    this.goBackName = params.goBackName;
    this.tableName = params.tableName;
    this.id = params.tableId;
    this.disabled = params.disabled === undefined ? true : params.disabled;
    this.fetchData(this.tableName, this.id)

  },
  methods: {
    fetchData(tableName, id) {
      if (tableName === undefined || tableName === null) {
        this.$router.push({
          name: 'customer'
        })
      } else {
        this.listLoading = true
        if (this.create) {
          getColumns(tableName).then(response => {
            console.log(this.form)
            this.form = response.data.tableDataList[0];
            this.tableColumns = response.data.tableColumns;
            this.listLoading = false
          })
        } else {
          getMainTableById(tableName, id).then(response => {
            console.log(response.data)
            this.form = response.data.tableDataList[0];
            this.tableColumns = response.data.tableColumns;
            this.listLoading = false
          })
        }
      }

    },
    goBack() {
      this.$router.push({
        name: this.goBackName
      })
    },
    saveTable() {
      this.listLoading = true
      if (this.create) {
        //新增
        addMainTable(this.tableName, this.form).then(response => {
          this.$message('新增成功！')
          this.listLoading = false
          this.goBack();
        })
      } else if (this.edit) {
        //编辑
        updateMainTable(this.tableName, this.form).then(response => {
          this.$message('修改成功')
          this.edit = !this.edit
          this.disabled = !this.disabled

          this.fetchData(this.tableName, this.id);
          this.listLoading = false
        })
      } else {
        this.edit = !this.edit
        this.disabled = !this.disabled
        this.listLoading = false
      }
      this.listLoading = false

    },
    cancelTable() {
      if (this.create) {
        this.open('是否取消创建?', () => {
          this.$message({
            type: 'success',
            message: '已取消'
          });
          this.goBack();
        });
      } else if (this.edit) {
        this.edit = !this.edit
        this.disabled = !this.disabled
      } else {
        this.open('此操作将永久删除该, 是否继续?', () => {
          return deleteMainTable(this.tableName, this.form.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.goBack();
          });
        });
      }
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
    isShow(inserted) {
      if (this.create) {
        return inserted
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

