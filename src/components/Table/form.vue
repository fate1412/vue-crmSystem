<template>
  <div class="app-container" style="height: 700px; overflow: auto">

    <div style="display: block; height: 50px">
      <div v-if="this.goBack!==undefined" style="margin-bottom: 20px; float: left">
        <el-button @click="goBack()">返回</el-button>
      </div>
      <div style=" justify-content: right;margin-bottom: 20px; float: right">
        <div v-if="create || edit">
          <el-button v-if="this.isEdit" type="primary" @click="saveTable">提 交</el-button>
          <el-button v-if="this.isEdit" @click="cancelTable">取 消</el-button>
        </div>
        <div v-else>
          <el-button v-if="this.isEdit" type="primary" @click="saveTable">编 辑</el-button>
        </div>
      </div>
    </div>

    <h5>主对象</h5>
    <el-form v-loading="listLoading" ref="form" :inline="true" :model="form.main.data" label-width="200px"
             label-position="right">
      <el-form-item v-for="(column,index) in form.main.tableColumns" :key="index" :label="column.label"
                    v-if="isShow(column.inserted)"
                    style="width: 49%; min-width: 300px;">
        <!--        下拉选择框-->

        <el-select v-if="column.formType==='Select' && !column.link" v-model="form.main.data[column.prop]"
                   :label="column.label"
                   :disabled="((!hasCustom || (!create && column.disabled )) || disabled)" placeholder="">

          <el-option v-for="item in column.options" :key="item.optionKey" :label="item.option" :value="item.optionKey"/>

        </el-select>

        <my-el-select v-else-if="column.formType==='Select' && column.link" v-model="form.main.data[column.prop]"
                      :disabled="((!hasCustom || (!create && column.disabled )) || disabled)" placeholder=""
                      :initialName="form.main.data[column.prop + 'R'].name"
                      :doSelectList="getOptions" :tableName="form.main.data[column.prop + 'R'].tableName"
        />

        <!--        时间-->
        <div v-else-if="column.formType==='Date' || column.formType==='DateTime'" style="width: 200%">
          <el-col style="width: 41%">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.main.data[column.prop]"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <div v-if="column.formType==='DateTime'">
            <el-col class="line" :span="2">-</el-col>
            <el-col style="width: 40%">
              <el-time-picker placeholder="选择时间" v-model="form.main.data[column.prop]"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"
                              style="width: 100%;"></el-time-picker>
            </el-col>
          </div>
        </div>
        <!--        Switch开关-->
        <el-switch v-else-if="column.formType==='Boolean'" v-model="form.main.data[column.prop]"
                   :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"/>
        <!--        Input-->
        <el-input v-else-if="column.formType==='String'" v-model="form.main.data[column.prop]"
                  :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"/>
        <el-input v-else-if="column.formType==='Number'" v-model="form.main.data[column.prop]"
                  @input="getNumber(column.prop)"
                  :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"/>
        <el-input v-else-if="column.formType==='Integer'" v-model="form.main.data[column.prop]"
                  @input="getNumber(column.prop)"
                  :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"/>
        <el-input v-else-if="column.formType==='Double'" v-model="form.main.data[column.prop]"
                  @input="getDouble(column.prop)"
                  :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"/>
        <el-input v-else-if="column.formType==='Long'" v-model="form.main.data[column.prop]"
                  @input="getNumber(column.prop)"
                  :disabled="((!hasCustom || (!create && column.disabled )) || disabled)"/>
      </el-form-item>

    </el-form>

    <!--子对象-->
    <div v-if="form.child!==undefined && form.child !== null" style="padding: 10px;">
      <h5>子对象</h5>
      <el-button :disabled="disabled" type="warning" @click="childAdd()">新增</el-button>
      <el-table :data="form.child.dataList" border style="width: 100%">
        <el-table-column v-for="(column,index) in form.child.tableColumns" :key="index" align="center"
                         :label="column.label"
                         :prop="column.prop" :fixed="column.fixed">
          <template slot-scope="scope">
            <!--        下拉选择框-->
            <el-select v-if="column.formType==='Select' && !column.link" v-model="scope.row[column.prop]"
                       :label="column.label"
                       :ref="'child.' + scope.$index+'.'+index"
                       :disabled="(!create && column.disabled ) || disabled" placeholder=""
                       v-show="scope.row.isEditor"
            >

              <el-option v-for="item in column.options" :key="item.optionKey" :label="item.option"
                         :value="item.optionKey"/>

            </el-select>

            <my-el-select v-else-if="column.formType==='Select' && column.link" v-model="scope.row[column.prop]"
                          :disabled="(!create && column.disabled ) || disabled"
                          placeholder="" :initialName="scope.row[column.prop + 'R'].name"
                          :ref="'child.' + scope.$index+'.'+index"
                          :doSelectList="getOptions" :tableName="scope.row[column.prop + 'R'].tableName"
                          v-show="scope.row.isEditor"/>
            <div v-else :disabled="(!create && column.disabled ) || disabled" v-show="scope.row.isEditor">
              <el-input v-if="column.formType==='Number'" v-model="scope.row[column.prop]"
                        @input="getChildNumber(column.prop,scope.$index)"/>
              <el-input v-else-if="column.formType==='Integer'" v-model="scope.row[column.prop]"
                        @input="getChildNumber(column.prop,scope.$index)"/>
              <el-input v-else-if="column.formType==='Double'" v-model="scope.row[column.prop]"
                        @input="getChildDouble(column.prop,scope.$index)"/>
              <el-input v-else-if="column.formType==='Long'" v-model="scope.row[column.prop]"
                        @input="getChildNumber(column.prop,scope.$index)"/>
              <el-input v-else v-model="scope.row[column.prop]"/>
            </div>
            <span v-if="column.formType==='Select' && column.link"
                  v-show="!scope.row.isEditor">
              {{ scope.row[column.prop + 'R'].name }}
            </span>
            <span v-else v-show="!scope.row.isEditor">{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button :disabled="disabled" type="warning" @click="childEdit(scope.row, scope.$index)">
              {{ scope.row.isEditor ? "保存" : "编辑" }}
            </el-button>
            <el-button :disabled="disabled" type="danger" @click="childDel(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import myElSelect from '@/components/Table/my-el-select'

import { getOptions, getMainTableById, updateMainTable, addMainTable, getColumns } from '@/api/table'

export default {
  components: {
    myElSelect
  },
  props: {
    goBack: Function,
    submit: Function,
    status: Object,
    tableName: String,
    id: Number,
    hasCustom: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      listLoading: true,
      form: {
        main: {
          data: {},
          tableColumns: []
        },
        child: {
          tableColumns: [],
          dataList: [],
          baseForm: {}
        },

      },
      disabled: false,
      edit: false,
      create: true,
      //权限
      isDelete: false,
      isEdit: false
    }
  },
  watch: {
    'status': {
      handler(status) {
        this.create = status.create === undefined ? true : status.create
        this.disabled = status.disabled === undefined ? false : status.disabled
        this.isDelete = status.isDelete || false;
        this.isEdit = status.isEdit || false;
        this.form.child = {
          tableColumns: [],
          dataList: [],
          baseForm: {}
        }
        this.fetchData(this.tableName, this.id)
      },
      deep: true
    },
    id(id) {
      this.form.child = {
        tableColumns: [],
        dataList: [],
        baseForm: {}
      }
      this.fetchData(this.tableName, id)
    }
  },
  created() {
    const status = this.status
    this.create = status.create === undefined ? true : status.create
    this.disabled = status.disabled === undefined ? false : status.disabled
    this.isDelete = status.isDelete || false;
    this.isEdit = status.isEdit || false;
    this.fetchData(this.tableName, this.id)
  },
  methods: {
    fetchData(tableName, id) {
      this.listLoading = true
      if (this.create) {
        getColumns(tableName).then(response => {
          const data = response.data;
          this.form.main.data = data.tableDataList[0];
          this.form.main.tableColumns = data.tableColumns;
          //处理Select框初始值为null问题
          for(let i=0; i< data.tableColumns.length; i++) {
            let prop = data.tableColumns[i].prop
            if (data.tableColumns[i].formType === 'Select') {
              this.form.main.data[prop] = this.form.main.data[prop] || ''
            } else if (data.tableColumns[i].formType === 'Boolean') {
              this.form.main.data[prop] = this.form.main.data[prop] || false
            }
          }
          if (data.child === undefined || data.child === null) {
            this.form.child = null
          } else {
            this.form.child.tableColumns = data.child.tableColumns
            this.form.child.baseForm = data.child.tableDataList[0]
          }
          this.listLoading = false
        })
      } else {
        getMainTableById(tableName, id).then(response => {
          const data = response.data;
          this.form.main.data = data.tableDataList[0];
          this.form.main.tableColumns = data.tableColumns;
          //处理Select框初始值为null问题
          for(let i=0; i< data.tableColumns.length; i++) {
            let prop = data.tableColumns[i].prop
            if (data.tableColumns[i].formType === 'Select') {
              this.form.main.data[prop] = this.form.main.data[prop] || ''
            } else if (data.tableColumns[i].formType === 'Boolean') {
              this.form.main.data[prop] = this.form.main.data[prop] || false
            }
          }
          if (data.child === undefined || data.child === null) {
            this.form.child = null
          } else {
            this.form.child.tableColumns = data.child.tableColumns
            if(data.child.tableDataList[0].id !== null) {
              this.form.child.dataList = data.child.tableDataList
            }
            this.form.child.baseForm = data.child.tableDataList[0]
          }
          this.listLoading = false
        })
      }
    },
    cancelTable() {
      if (this.create) {
        this.open('是否取消创建?', () => {
          this.$message({
            type: 'success',
            message: '已取消'
          });
          if (this.goBack !== undefined) {
            this.goBack();
          }
        });
      } else if (this.edit) {
        this.edit = !this.edit
        this.disabled = !this.disabled
        this.fetchData(this.tableName, this.id)
      }
    },
    saveTable() {
      this.listLoading = true
      const data = this.form.main.data;
      if (this.form.child !== null) {
        data.childList = this.form.child.dataList
      }
      if (this.submit === undefined || !this.submit(data,this)) {
        if (this.create) {
          //新增
          addMainTable(this.tableName, data).then(response => {
            this.$message('新增成功！')
            this.listLoading = false
            this.fetchData(this.tableName, this.id);
            if (this.goBack !== undefined) {
              this.goBack();
            }
          })
        } else if (this.edit) {
          //编辑
          updateMainTable(this.tableName, data).then(response => {
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
      }
      this.listLoading = false

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
    },
    childEdit(row, index) {
      if (row.isEditor) {
        const columns = this.form.child.tableColumns
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].formType === 'Select' && this.$refs['child.' + index + '.' + i][0].name !== '') {
            row[columns[i].prop + 'R'].name = this.$refs['child.' + index + '.' + i][0].name
          }
        }
      }
      row.isEditor = !row.isEditor;
    },
    childDel(row, index) {
      this.form.child.dataList.splice(index, 1)
    },
    childAdd() {
      let data = {
        "isEditor": false
      }
      const columns = this.form.child.tableColumns
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].formType === 'Select') {
          console.log(columns[i])
          data[columns[i].prop + 'R'] = {
            'name': '',
            'tableName': this.form.child.baseForm[columns[i].prop + 'R'].tableName
          }
        }
      }
      this.form.child.dataList.push(data)
    },
    getNumber(prop) {
      this.form.main.data[prop] = this.form.main.data[prop].replace(/[^0-9]/g,'')
    },
    getDouble(prop) {
      this.form.main.data[prop] = this.form.main.data[prop]
        .replace(/[^\d^.]+/g,'') // 第二步：把不是数字，不是小数点的过滤掉
        .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
        .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
        .match(/^\d*(\.?\d{0,5})/g)[0] || ''; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到5位小数"
    },
    getChildNumber(prop,index) {
      this.form.child.dataList[index][prop] = this.form.child.dataList[index][prop].replace(/[^0-9]/g,'')
    },
    getChildDouble(prop,index) {
      this.form.child.dataList[index][prop] = this.form.child.dataList[index][prop]
        .replace(/[^\d^.]+/g,'') // 第二步：把不是数字，不是小数点的过滤掉
        .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
        .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
        .match(/^\d*(\.?\d{0,5})/g)[0] || ''; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到5位小数"
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

</style>

