Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))
// New VueJS instance
new Vue({
  name: 'notebook',

  // CSS selector of the root DOM element
  el: '#notebook',

  // Some data
  data() {
    return {
      //content: 'This is a note',
      //content: localStorage.getItem('content') || 'You can write in **markdown**',
      notes:JSON.parse(localStorage.getItem("notes")) || [],
      selectedId:null
    }
  },
  computed: {
    linesCount() {
      if (this.selectedNote) {
        // 计算换行符的个数
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },

    wordsCount() {
      if (this.selectedNote) {
        var s = this.selectedNote.content
        // 将换行符转换为空格
        s = s.replace(/\n/g, ' ')
        // 排除开头和结尾的空格
        s = s.replace(/(^\s*)|(\s*$)/gi, '')
        // 将多个重复空格转换为一个
        s = s.replace(/\s\s+/gi, ' ')
        // 返回空格数量
        return s.split(' ').length
      }
    },
    charactersCount() {
      if (this.selectedNote) {
        return this.selectedNote.content.split('').length
      }
    },

    notePreview() {
      // Markdown rendered to HTML
      return  this.selectedNote ? marked(this.selectedNote.content) : ''
    },
    selectedNote(){
      return this.notes.find(note => note.id === this.selectedId)
    },
    sortedNotes(){
      return this.notes.slice()
      .sort((a,b) => a.created - b.created)
      .sort((a,b) =>(a.favorite === b.favorite) ? 0 
           : a.favorite ?-1
           : 1)
    },
  },

  watch: {

    notes: {

      handler: 'saveNotes',
  
      deep: true,
    },

    selectedId (val, oldVal) {
      localStorage.setItem('selected-id', val)
    },
  },
methods: {
  saveNote(){
    localStorage.setItem("content",this.content)
    console.log(this)
  },
  addNote(){
    const time =  Date.now()
    const note = {
      id:String(time),
      title:'New note'+(this.notes.length+1),
      content:this.content,
      created:time,
      favorite:false
    }
    this.notes.push(note)
  },
  selectNote (note) {
    console.log(note)
    this.selectedId = note.id
  },
  saveNotes(){
    localStorage.setItem("notes",JSON.stringify(this.notes))
    console.log("add")
  },
  removeNote(){
    if(this.selectedNote && confirm('Delete the note?')){
      const index = this.notes.indexOf(this.selectedNote)
      if(index !== -1){
          this.notes.splice(index,1)
      }
    }
  },
  favoriteNote(){
    this.selectedNote.favorite ^= true
  }
},
created(){
  this.content =  localStorage.getItem('content') || 'You can write in **markdown**'
},


})