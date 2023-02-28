<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit height="250"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(column,index) in table_columns" :key="index" align="center" :label="column.title"
                       width="95" :prop="column.name" :fixed="column.name === 'id'">
      </el-table-column>


      <!--      <el-table-column align="center" label="ID" width="95">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.$index }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Title">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.title }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Author" width="110" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.author }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="Pageviews" width="110" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.pageviews }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column class-name="status-col" label="Status" width="110" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
      <!--        <template slot-scope="scope">-->
      <!--          <i class="el-icon-time"/>-->
      <!--          <span>{{ scope.row.display_time }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import { getList, getMainList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      multipleSelection: [],
      table_columns: [],
      list: null,
      listLoading: true

    }
  },
  created() {
    console.log(this.$route.name)
    this.fetchData(this.$route.name)
  },
  methods: {
    fetchData(tableName) {
      this.listLoading = true

      if (tableName === 'customer') {
        getMainList(tableName, 1).then(response => {
          console.log(response.data)
          this.list = response.data.tableDataList;
          this.table_columns = response.data.tableColumns;
          this.listLoading = false
        })
      } else {
        getList(tableName).then(response => {
          this.list = response.data.items
          this.listLoading = false
        })
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    resetData() {
      console.log(this.$route.name)
      //在这里获取并处理该路由下所需要的数据。
      const tableName = this.$route.name;
      this.fetchData(tableName);
    }
  },
  watch: {
    $route: {
      handler: 'resetData',
    }
  }
}
</script>
