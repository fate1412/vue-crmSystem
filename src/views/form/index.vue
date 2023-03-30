<template>
  <div class="app-container">

    <div style="display: block; height: 50px">
      <div style="margin-bottom: 20px; float: left">
        <el-button @click="goBack">返回</el-button>
      </div>
      <div style=" justify-content: right;margin-bottom: 20px; float: right">
        <div v-if="create || edit">
          <el-button v-if="this.isEdit" type="primary" @click="saveTable">提 交</el-button>
          <el-button v-if="this.isEdit" @click="cancelTable">取 消</el-button>
        </div>
        <div v-else>
          <el-button v-if="this.isEdit" type="primary" @click="saveTable">编 辑</el-button>
          <el-button v-if="this.isDelete" type="danger" @click="cancelTable">删 除</el-button>
        </div>
      </div>
    </div>

    <h5>主对象</h5>
    <el-form v-loading="listLoading" ref="form" :inline="true" :model="form" label-width="200px" label-position="right">
      <el-form-item v-for="(column,index) in tableColumns" :key="index" :label="column.label"
                    v-if="isShow(column.inserted)"
                    style="width: 49%; min-width: 300px;">
        <!--        下拉选择框-->

        <el-select v-if="column.formType==='Select' && !column.link" v-model="form[column.prop]" :label="column.label"
                   :disabled="(!create && column.disabled ) || disabled" placeholder="">

          <el-option v-for="item in column.options" :key="item.optionKey" :label="item.option" :value="item.optionKey"/>

        </el-select>

        <my-el-select v-else-if="column.formType==='Select' && column.link" v-model="form[column.prop]"
                      :disabled="(!create && column.disabled ) || disabled" placeholder=""
                      :initialName="form[column.prop + 'R'].name"
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
                              :disabled="(!create && column.disabled ) || disabled"
                              style="width: 100%;"></el-time-picker>
            </el-col>
          </div>
        </div>
        <!--        Switch开关-->
        <el-switch v-else-if="column.formType==='Boolean'" v-model="form[column.prop]"
                   :disabled="(!create && column.disabled ) || disabled"/>
        <!--        Input-->
        <el-input v-else-if="column.formType==='Number'" v-model="form[column.prop]"
                  @input="getNumber(column.prop)"
                  :disabled="(!create && column.disabled ) || disabled"/>
        <el-input v-else-if="column.formType==='Integer'" v-model="form[column.prop]"
                  @input="getNumber(column.prop)"
                  :disabled="(!create && column.disabled ) || disabled"/>
        <el-input v-else-if="column.formType==='Double'" v-model="form[column.prop]"
                  @input="getDouble(column.prop)"
                  :disabled="(!create && column.disabled ) || disabled"/>
        <el-input v-else-if="column.formType==='Long'" v-model="form[column.prop]"
                  @input="getNumber(column.prop)"
                  :disabled="(!create && column.disabled ) || disabled"/>
        <el-input v-else v-model="form[column.prop]"
                  :disabled="(!create && column.disabled ) || disabled"/>
      </el-form-item>

    </el-form>

    <!--子对象-->
    <div v-if="child!==undefined && child !== null" style="padding: 10px;">
      <h5>子对象</h5>
      <el-button :disabled="disabled" type="warning" @click="childAdd()">新增</el-button>
      <el-table :data="child.forms" border style="width: 100%">
        <el-table-column v-for="(column,index) in child.tableColumns" :key="index" align="center" :label="column.label"
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

import { getOptions, getMainTableById, updateMainTable, addMainTable, deleteMainTable, getColumns } from '@/api/table'
import { getCustomTableById, getCustomColumns, addCustomTable, updateCustomTable, deleteCustomTable, getCustomOptions, isCustomTable } from '@/api/customTable'

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
      child: {
        tableColumns: [],
        forms: []
      },
      tableColumns: [],
      disabled: true,
      edit: false,
      create: true,
      //权限
      isDelete: false,
      isEdit: false,
      isInsert: false,
      //是否定制
      isCustom: false
    }
  },
  created() {
    const params = this.$route.params
    this.create = params.create === undefined ? true : params.create
    console.log(params.goBackName)
    this.goBackName = params.goBackName;
    this.tableName = params.tableName;
    this.id = params.tableId;
    this.disabled = params.disabled === undefined ? true : params.disabled;
    this.isDelete = params.isDelete || false;
    this.isEdit = params.isEdit || false;
    this.isCustom = params.isCustom === undefined ? false : params.isCustom;
    this.fetchData(this.tableName, this.id)

  },
  methods: {
    fetchData(tableName, id) {
      if (tableName === undefined || tableName === null) {
        this.$router.push({
          name: 'customer'
        })
      } else {
        if (!this.isCustom) {
          this.getMainTable(tableName, id)
        } else {
          this.getCustomTable(tableName, id)
        }
      }

    },
    getMainTable(tableName, id) {
      this.listLoading = true
      if (this.create) {
        getColumns(tableName).then(response => {
          const data = response.data;
          this.form = data.tableDataList[0];
          this.tableColumns = data.tableColumns;
          if (data.child === undefined || data.child === null) {
            this.child = null
          } else {
            this.child.tableColumns = data.child.tableColumns
            this.child.baseForm = data.child.tableDataList[0]
          }
          this.listLoading = false
        })
      } else {
        getMainTableById(tableName, id).then(response => {
          const data = response.data;
          this.form = data.tableDataList[0];
          this.tableColumns = data.tableColumns;
          if (data.child === undefined || data.child === null) {
            this.child = null
          } else {
            this.child.tableColumns = data.child.tableColumns
            if(data.child.tableDataList[0].id !== null) {
              this.child.forms = data.child.tableDataList
            }
            this.child.baseForm = data.child.tableDataList[0]
          }
          this.listLoading = false
        })
      }
    },
    getCustomTable(tableName,id) {
      this.listLoading = true
      if (this.create) {
        getCustomColumns(tableName).then(response => {
          const data = response.data;
          this.form = data.tableDataList[0];
          this.tableColumns = data.tableColumns;
          if (data.child === undefined || data.child === null) {
            this.child = null
          } else {
            this.child.tableColumns = data.child.tableColumns
            this.child.baseForm = data.child.tableDataList[0]
          }
          this.listLoading = false
        })
      } else {
        getCustomTableById(tableName, id).then(response => {
          const data = response.data;
          this.form = data.tableDataList[0];
          this.tableColumns = data.tableColumns;
          if (data.child === undefined || data.child === null) {
            this.child = null
          } else {
            this.child.tableColumns = data.child.tableColumns
            if(data.child.tableDataList[0].id !== null) {
              this.child.forms = data.child.tableDataList
            }
            this.child.baseForm = data.child.tableDataList[0]
          }
          this.listLoading = false
        })
      }
    },
    goBack() {
      this.$router.push({
        name: this.goBackName
      })
    },
    saveTable() {
      if (!this.isCustom) {
        this.saveMainTable()
      } else {
        this.saveCustomTable()
      }
    },
    saveMainTable() {
      this.listLoading = true
      const data = this.form;
      if (this.child !== null) {
        data.childList = this.child.forms
      }
      if (this.create) {
        //新增
        addMainTable(this.tableName, data).then(response => {
          this.$message('新增成功！')
          this.listLoading = false
          this.goBack();
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
      this.listLoading = false
    },
    saveCustomTable() {
      this.listLoading = true
      const data = this.form;
      if (this.child !== null) {
        data.childList = this.child.forms
      }
      data.tableName = this.tableName;
      if (this.create) {
        //新增
        addCustomTable(data).then(response => {
          this.$message('新增成功！')
          this.listLoading = false
          this.goBack();
        })
      } else if (this.edit) {
        //编辑
        updateCustomTable(data).then(response => {
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
        this.fetchData(this.tableName, this.id)
      } else {
        this.open('此操作将永久删除该, 是否继续?', () => {
          let data = {
            'id': this.form.id
          }
          if (!this.isCustom) {
            return deleteMainTable(this.tableName, data).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.goBack();
            });
          } else {
            return deleteCustomTable(this.tableName, this.form.id).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.goBack();
            });
          }
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
      const isCustom = isCustomTable(tableName)
      if (!isCustom) {
        return getOptions(params).then(res => {
          return Promise.resolve(res.data)
        })
      } else {
        return getCustomOptions(params).then(res => {
          return Promise.resolve(res.data)
        })
      }
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
        const columns = this.child.tableColumns
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].formType === 'Select' && this.$refs['child.'+index+'.'+i][0].name !=='') {
            row[columns[i].prop + 'R'].name = this.$refs['child.'+index+'.'+i][0].name
          }
        }
      }
      row.isEditor = !row.isEditor;
    },
    childDel(row, index) {
      this.child.forms.splice(index, 1)
    },
    childAdd() {
      let data = {
        "isEditor": false
      }
      const columns = this.child.tableColumns
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].formType === 'Select') {
          console.log(columns[i])
          data[columns[i].prop + 'R'] = {
            'name': '',
            'tableName': this.child.baseForm[columns[i].prop + 'R'].tableName
          }
        }

      }
      this.child.forms.push(data)
    },
    getNumber(prop) {
      this.form[prop] = this.form[prop].replace(/[^0-9]/g,'')
    },
    getDouble(prop) {
      this.form[prop] = this.form[prop]
        .replace(/[^\d^.]+/g,'') // 第二步：把不是数字，不是小数点的过滤掉
        .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
        .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
        .match(/^\d*(\.?\d{0,5})/g)[0] || ''; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到5位小数"
    },
    getChildNumber(prop,index) {
      this.child.forms[index][prop] = this.child.forms[index][prop].replace(/[^0-9]/g,'')
    },
    getChildDouble(prop,index) {
      this.child.forms[index][prop] = this.child.forms[index][prop]
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

