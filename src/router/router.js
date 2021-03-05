const MainRoutes = [
    {
        path: "mine",
        name:'Mine',
        component: () => import('../views/Mine')
    },
    {
        path: "home",
        name:"Home",
        alias: '/',
        component: () => import('../views/Home')
    },
    {
        path: "shopbag",
        name:"Shopbag",
        component: () => import('../views/Shopbag')
    },
    {
        path: "menu",
        name:'Menu',
        component: () => import('../views/Menu')
    },
]

export const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login')
    },
    {
        path: '/',
        name: 'Main',
        component: () => import('../views/Main'),
        children: MainRoutes
    },
    {
        path: '/details/:pid',
        name: 'Details',
        component: () => import('../views/Details')
    },
    {
        path: '/addressList',
        name: 'AddressList',
        component: () => import('../views/AddressList')
    },
    {
        path: '/address/:aid?',
        name: 'Address',
        component: () => import('../views/Address')
    },
    {
        path: '/pay',
        name: 'Pay',
        component: () => import('../views/Pay')
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import('../views/Order')
    },
    {
        path: '/like',
        name: 'Like',
        component: () => import('../views/Like')
    },
    {
        path: '/person',
        name: 'Person',
        component: () => import('../views/Person')
    },
    {
        path: '/updateName',
        name: 'UpdateName',
        component: () => import('../views/UpdateName')
    },
    {
        path: '/updateAccount',
        name: 'UpdateAccount',
        component: () => import('../views/UpdateAccount')
    },
    {
        path: '/security',
        name: 'Security',
        component: () => import('../views/Security')
    },
    {
        path: '/updatePass',
        name: 'UpdatePass',
        component: () => import('../views/UpdatePass')
    },
    {
        path: '/forgetPass',
        name: 'ForgetPass',
        component: () => import('../views/ForgetPass')
    },
]