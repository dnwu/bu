import Login from '../pages/login';
import Main from '../pages/main';
import Manage from '../pages/manage';
import Reserve from '../pages/reserve';
import CreateActive from '../pages/creatActive'
import NotFind from '../pages/404'


const routerConfig = [
    {
        path: '/main',
        component: Main,
        auth: true,
    }, {
        path: '/login',
        component: Login,
    }, {
        path: '/manage',
        component: Manage,
        auth: true,
    }, {
        path: '/create-active',
        component: CreateActive,
        auth: true,
    }, {
        path: '/reserve',
        component: Reserve,
        auth: true,
    }, {
        path: '/404',
        component: NotFind,
    }
]

export default routerConfig