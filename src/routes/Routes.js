import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/home/Home.vue'
import Index from '../views/index/Index.vue';
import UserList from '../views/user/UserList.vue'
import WalletList from '../views/wallet/WalletList.vue'
import WalletLogList from '../views/walletlog/WalletLogList.vue';
import WalletAsset from '../views/wallet/WalletAsset.vue';
import FeeList from "../views/fee/FeeList.vue";
import EntrustList from "../views/entrust/EntrustList.vue";
import CloseLineList from "../views/closeLine/CloseLineList.vue";
import StockList from "../views/stock/StockList.vue";
import TradeTimeList from "../views/tradetime/TradeTimeList.vue";
import RechargeList from "../views/finance/recharge/RechargeList.vue";
import WithdrawalList from "../views/finance/withdrawal/WithdrawalList.vue";
import CompanyList from "../views/company/CompanyList.vue";
import AdminList from "../views/admin/AdminList.vue";
import AdminLogList from "../views/adminLog/AdminLogList.vue";
import AppVersionList from "../views/appVersion/AppVersionList.vue";
import SystemList from "../views/system/SystemList.vue";
import ArticleClassifyList from "../views/article/ArticleClassifyList.vue";
import ArticleList from "../views/article/ArticleList.vue";
import BankList from "../views/bank/BankList.vue";
import BankCardList from "../views/bank/BankCardList.vue";
import PaymentList from "../views/payment/PaymentList.vue";
import CapitalList from "../views/report/capital/CapitalList.vue";
import HoldList from "../views/report/hold/HoldList.vue";
import FlatList from "../views/report/flat/FlatList.vue";
import HangUpList from "../views/report/hangUp/HangUpList.vue";


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
                name: '主页',
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
                path: '/feelist',
                component: FeeList,
                name: '仓息列表'
            },
            {
                path: '/capitallist',
                component: CapitalList,
                name: '资金报表'
            },
            {
                path: '/holdlist',
                component: HoldList,
                name: '持仓报表'
            },
            {
                path: '/flatlist',
                component: FlatList,
                name: '平仓报表'
            },
            {
                path: '/hanguplist',
                component: HangUpList,
                name: '挂单报表'
            },
            {
                path: '/entrustlist',
                component: EntrustList,
                name: '委托列表'
            },
            {
                path: '/closelinelist',
                component: CloseLineList,
                name: '风险率列表'
            },
            {
                path: '/stocklist',
                component: StockList,
                name: '股票列表'
            },
            {
                path: '/tradetimelist',
                component: TradeTimeList,
                name: '交易时间'
            },
            {
                path: '/rechargelist',
                component: RechargeList,
                name: '充值列表'
            },
            {
                path: '/withdrawallist',
                component: WithdrawalList,
                name: '提现列表'
            },
            {
                path: '/companylist',
                component: CompanyList,
                name: '公司列表'
            },
            {
                path: '/adminlist',
                component: AdminList,
                name: '管理员列表'
            },
            {
                path: '/adminloglist',
                component: AdminLogList,
                name: '管理员日志列表'
            },
            {
                path: '/appversionlist',
                component: AppVersionList,
                name: 'app版本列表'
            },
            {
                path: '/systemlist',
                component: SystemList,
                name: '系统参数列表'
            },
            {
                path: '/articlelist',
                component: ArticleList,
                name: '文章列表'
            },
            {
                path: '/articleClassifylist',
                component: ArticleClassifyList,
                name: '文章分类列表'
            },
            {
                path: '/banklist',
                component: BankList,
                name: '银行列表'
            },
            {
                path: '/bankcardlist',
                component: BankCardList,
                name: '银行卡列表'
            },
            {
                path: '/paymentlist',
                component: PaymentList,
                name: '支付方式列表'
            },
        ]
    },

];

export default routes;