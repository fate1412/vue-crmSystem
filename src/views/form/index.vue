<template>
  <div class="app-container">
    <div style="display: flex;justify-content: right;margin-bottom: 20px">
      <el-button type="primary" @click="editTable">编辑</el-button>
      <el-button @click="deleteTable">删除</el-button>
    </div>


    <el-form ref="form" :inline="true" :model="form" label-width="100px" label-position="right">
        <el-form-item v-for="(column,index) in tableColumns" :key="index" :label="column.title"
        style="width: 49%; min-width: 300px">
          <el-select v-if="column.formType==='Select'" v-model="form[column.name]" :label="column.title"
                     :disabled="column.disabled || disabled" placeholder="请选择活动区域"></el-select>
          <div v-else-if="column.formType==='Date'">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form[column.name]"
                              :disabled="column.disabled || disabled" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="form[column.name]"
                              :disabled="column.disabled || disabled" style="width: 100%;"></el-time-picker>
            </el-col>
          </div>

          <el-input v-else v-model="column.link? form[column.name].name : form[column.name]" :disabled="column.disabled || disabled"/>
        </el-form-item>

      <!--      <el-form-item label="Activity name">-->
      <!--        <el-input v-model="form.name"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="Activity zone">-->
      <!--        <el-select v-model="form.region" placeholder="please select your zone">-->
      <!--          <el-option label="Zone one" value="shanghai"/>-->
      <!--          <el-option label="Zone two" value="beijing"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="Activity time">-->
      <!--        <el-col :span="11">-->
      <!--          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;"/>-->
      <!--        </el-col>-->
      <!--        <el-col :span="2" class="line">-</el-col>-->
      <!--        <el-col :span="11">-->
      <!--          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>-->
      <!--        </el-col>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="Instant delivery">-->
      <!--        <el-switch v-model="form.delivery"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="Activity type">-->
      <!--        <el-checkbox-group v-model="form.type">-->
      <!--          <el-checkbox label="Online activities" name="type"/>-->
      <!--          <el-checkbox label="Promotion activities" name="type"/>-->
      <!--          <el-checkbox label="Offline activities" name="type"/>-->
      <!--          <el-checkbox label="Simple brand exposure" name="type"/>-->
      <!--        </el-checkbox-group>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="Resources">-->
      <!--        <el-radio-group v-model="form.resource">-->
      <!--          <el-radio label="Sponsor"/>-->
      <!--          <el-radio label="Venue"/>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="Activity form">-->
      <!--        <el-input v-model="form.desc" type="textarea"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-button type="primary" @click="onSubmit">Create</el-button>-->
      <!--        <el-button @click="onCancel">Cancel</el-button>-->
      <!--      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
import { getList, getMainTableById } from '@/api/table'

export default {
  data() {
    return {
      form: {},
      tableColumns: [
        {
          "title": "客户类型",
          "name": "customerType",
          "fixed": false,
          "link": false,
          "formType": "select",
          "disabled": ""
        }
      ],
      disabled: true
    }
  },
  created() {
    console.log(this.$route.params)
    this.fetchData(this.$route.params.tableName,this.$route.params.tableId)
  },
  methods: {
    fetchData(tableName,id) {
      this.listLoading = true

      if (tableName === 'customer') {
        getMainTableById(tableName, id).then(response => {
          console.log(response.data)
          this.form = response.data.tableDataList[0];
          this.tableColumns = response.data.tableColumns;
          this.listLoading = false
        })
      } else {
        getList(tableName).then(response => {
          this.tableDataList = response.data.items
          this.listLoading = false
        })
      }
    },
    editTable() {
      this.$message('submit!')
    },
    deleteTable() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

