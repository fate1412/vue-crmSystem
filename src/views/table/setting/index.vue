<template>
  <el-row class="tac">
    <el-col :span="3">
      <el-menu default-active="2" class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose">

        <el-menu-item v-for="(table,index) in tablesName" :index="index"
                      @click="getColumns(table.tableName)">
          <i class="el-icon-document"></i>
          <span slot="title">{{ table.showName }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col :span="21">

      <el-menu default-active="2" class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose">

        <el-submenu v-for="(column,index) in tableColumns" :index="index">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span>{{ column.showName }}      {{ column.columnName }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(type,index) in column.columnType" :index="index">11{{type.option}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import { getTables, getTableColumns } from '@/api/table'

export default {
  name: "index",
  data() {
    return {
      tableColumns: [],
      tablesName: [],
      tableDataList: null,
    }
  },
  created() {
    this.showTables()
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    showTables() {
      getTables().then(res => {
        console.log(res.data)
        this.tablesName = res.data;
      })
    },
    getColumns(tableName) {
      getTableColumns(tableName).then(res => {
        this.tableColumns = res.data;
      })
    }

  }
}
</script>

<style scoped>

</style>
