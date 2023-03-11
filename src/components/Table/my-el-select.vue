<template>
  <el-select v-model="svalue" filterable remote reserve-keyword :placeholder="placeholder"
             :remote-method="getSelectList"
             :loading="loading" :disabled="disabled"
             @change="schange"
             clearable v-el-select-lazyLoading="doGetList" ref="optionRef" >
    <el-option
        v-for="item in selectList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import debounce from "lodash/debounce";
export default {
  data() {
    return {
      selectList: [],
      currentPage: 1,
      loading: false,
      previousQuery: '',
      svalue: this.value,
      name: ''
    }
  },
  watch: {
    value(newValue) {
      console.log(1)
      this.svalue = newValue || ''
    },
    svalue(newVal,oldVal) {
      console.log(2)
      if(newVal !== oldVal) {
        newVal = newVal || ''
        this.$emit("input",newVal)
      }
      this.$emit("input",newVal || '')
    }
  },
  created() {
    this.doSelectList('', 1,this.tableName).then((data) => {
      this.selectList = [...data]
      this.currentPage++;
    })
  },
  props: {
    value: {
      type: [String, Number,],
      required: true,
      default: ''
    },
    doSelectList: {
      type: Function,
      default: () => {
        return Function;
      }
    },
    placeholder: String,
    disabled: Boolean,
    tableName: String
  },
  directives: {
    "el-select-lazyLoading": {
      bind(el, binding) {
        let SELECT_DOM = el.querySelector(
            ".el-select-dropdown .el-select-dropdown__wrap"
        )
        let INPUT_DOM = el.querySelector(
            ".el-input .el-input__inner"
        )
        SELECT_DOM.addEventListener("scroll", function () {
          let condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            let queryValue = INPUT_DOM.value
            binding.value(queryValue);
          }
        })
      }
    }
  },
  methods: {
    getSelectList : debounce(function (query){this.doGetList(query)},2000,{leading: true, trailing: false}),
    doGetList(query){
      //修改搜索条件则分页数变为1
      if (this.previousQuery !== query) {
        this.currentPage = 1
        this.selectList = []
        this.previousQuery = query
      }
      this.doSelectList(query, this.currentPage, this.tableName).then((data) => {
        //返回空集合则说明已经超过总页数
        if (!(data === undefined || data === null || data.length === 0))
        {
          this.loading = true;
          this.selectList = [...this.selectList, ...data]
          this.currentPage++;
          setTimeout(() => {
            this.loading = false
          },500)
        }
      }).catch(() =>{})
    },
    schange(val) {
      console.log(111)
      console.log(this.selectList);
      const selectedOption = this.selectList.find(option => option.id === val) || {};
      this.name = selectedOption.name
      console.log(selectedOption.id, selectedOption.name); // 输出选中的 label 和 value
    }
  }
}
</script>

<style scoped>

</style>
