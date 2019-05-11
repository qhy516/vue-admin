import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/home/Home.vue'
import Index from '../views/index/Index.vue';
import UserList from '../views/user/UserList.vue'
import WalletList from '../views/wallet/WalletList.vue'
import WalletLogList from '../views/walletlog/WalletLogList.vue';
import WalletAsset from '../views/wallet/WalletAsset.vue'


let routes = [{
        path: '/login',
        component: Login,
        name: '登陆',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '未找到页面',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: {
            path: '/404'
        }
    },
    {
        path: '/home',
        component: Home,
        children: [{
                path: '/index',
                component: Index,
                name: '主页'
            }, {
                path: '/userlist',
                component: UserList,
                name: '用户列表'
            },
            {
                path: '/walletlist',
                component: WalletList,
                name: '钱包列表'
            },
            {
                path: '/walletloglist',
                component: WalletLogList,
                name: '钱包日志列表'
            },
            {
                path: '/walletasset',
                component: WalletAsset,
                name: '资产估值'
            },
        ]

    },

];

export default routes;