# ajax
异步ajax 实现避免页面重复提交

## 问题描述
需要说明的是,重复提交对于不同情况有着不同的解决策略.
本文所述的方法,主要针对的是正常使用情况下,用户对于相同事件的误重复触发,譬如对于一个按钮,由于鼠标不好使或者新用户的不了解,连续点击两次以上.这种情况下,从页面js设计就可以解决;
与之正常使用情况对应的,即是异常情况,如某些用户恶意频繁发送请求,以获取一个网站的用户登录信息,这类问题就必然要和后台互动才能解决了,不在本文讨论范围内;
以下分情况讨论了可能出现的问题:

- 对于get请求,往往不会有什么太恶劣的影响,最多只是浪费下网络带宽,稍微增加服务器压力罢了,譬如查询两次相同的商品列表,仅是浪费时间;
- 对于post请求,重复触发很可能就产生用户不想要的某种后果,譬如点击通过积分购买商品,由于第一次网络较差导致反应时间较长,但用户以为自己第一次没有点击,于是再次点击,就相当于又发了一次post请求,最后的结果,就是买了两件相同的商品,这用户体验就很差了;
### 思路描述
ajax连续触发相同事件导致的重复提交,有一点可以利用的是:提交时的url必定相同.
所以只需将封装的ajax方法在发送请求之前,使用js变量存储该url,而在接收完相应数据后,再将该变量标记移除.
误操作导致要进行第二次ajax请求时,查询已有的js变量,如果变量标记存在,则说明第一次相应还没有回来,则直接禁止发送第二次相同的请求.
如此,即可避免ajax重复请求了.