import Login from '../pages/login';
import Main from '../pages/main';
import Manage from '../pages/manage';
import Reserve from '../pages/reserve';
import CreateActive from '../pages/creatActive'
import AddPerson from '../pages/addPerson'
import SearchIndex from './../pages/searchIndex'
import AllPeople from './../pages/allpeople'
import AllActive from './../pages/allActive'
import Search from './../pages/search'
import PersonInfo from './../pages/personInfo'
import PersonActiveList from './../pages/personActiveList'
import ActiveInfo from './../pages/activeInfo'
import ActivePersonList from './../pages/activePersonList'
import Statistics from './../pages/statistics'
import NotFind from '../pages/404'

import SearchByPeople from './../pages/searchBypeople'

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
        path: '/add-person',
        component: AddPerson,
        auth: true,
    }, {
        path: '/search/index',
        component: SearchIndex,
        auth: true,
    }, {
        path: '/search/all-people',
        component: AllPeople,
        auth: true,
    }, {
        path: '/search/all-active',
        component: AllActive,
        auth: true,
    }, {
        path: '/search/page',
        component: Search,
        auth: true,
    }, {
        path: '/search/person-info',
        component: PersonInfo,
        auth: true,
    }, {
        path: '/search/person-active-list',
        component: PersonActiveList,
        auth: true,
    }, {
        path: '/search/active-info',
        component: ActiveInfo,
        auth: true,
    }, {
        path: '/search/active-person-list',
        component: ActivePersonList,
        auth: true,
    }, {
        path: '/statistics',
        component: Statistics,
        auth: true,
    }, {
        path: '/404',
        component: NotFind,
    }, {
        path: "/search-by-people",
        component: SearchByPeople
    }
]

export default routerConfig