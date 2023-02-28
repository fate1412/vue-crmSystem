<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="tableDataList" element-loading-text="Loading" border fit
              height="650" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column v-for="(column,index) in tableColumns" :key="index" align="center" :label="column.title"
                       width="95" :prop="column.name" :fixed="column.fixed">
        <template slot-scope="scope">
          <el-link v-if="column.fixed" :underline="false"
                   style="color: deepskyblue" @click="getDetails(scope.row[column.name])">
            {{ scope.row[column.name] }}
          </el-link>
          <el-link v-else-if="column.link" :underline="false"
                   style="color: deepskyblue"
                   @click="getDetails(scope.row[column.name].id,scope.row[column.name].tableName)">
            {{ scope.row[column.name].name }}
          </el-link>
          <div v-else>{{ scope.row[column.name] }}</div>
        </template>
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
    <div class="block">

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.thisPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>


  </div>

</template>

<script>
import { getList, getMainListByPage } from '@/api/table'

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
      tableColumns: [],
      tableDataList: null,
      listLoading: true,
      page: {
        thisPage: 1,
        total: 1,
        pageSize: 20
      }

    }
  },
  created() {
    console.log(this.$route.name)
    this.fetchData(this.$route.name)
  },
  methods: {
    fetchData(tableName) {
      this.listLoading = true

      getMainListByPage(tableName, this.page.thisPage, this.page.pageSize).then(response => {
        console.log(response.data)
        this.tableDataList = response.data.tableDataList;
        this.tableColumns = response.data.tableColumns;
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.fetchData(this.$route.name)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    resetData() {
      console.log(this.$route.name)
      //在这里获取并处理该路由下所需要的数据。
      const tableName = this.$route.name;
      this.fetchData(tableName);
    },
    getDetails(id, tableName) {
      tableName = tableName === undefined ? this.$route.name : tableName;
      console.log(id + '  ' + tableName)
      this.$router.push({
        name: 'Form',
        params: {
          goBackName: this.$route.name,
          tableName: tableName,
          tableId: id
        }
      })
    }
  },
  watch: {
    $route: {
      handler: 'resetData',
    }
  }
}
</script>

