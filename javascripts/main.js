console.log('This would be the main JS file.');
$('#disqus_container .comment').on('click',function(){
$(this).html('加载中...');
var disqus_shortname = 'blogofleung';
var that = this;
BYB.includeScript('http://' + disqus_shortname + '.disqus.com/embed.js',function(){$(that).remove()}); //这是一个加载js的函数
});
