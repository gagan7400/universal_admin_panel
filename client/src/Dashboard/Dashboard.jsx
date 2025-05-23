import React from 'react'

export default function Dashboard() {
    return (
        <div class="w-full h-auto lg:h-screen bg-sitebg">
            <div class="antialiased">
                <nav class="bg-white shadow-sm px-4 py-3 fixed left-0 right-0 top-0 z-50">
                    <div class="flex flex-wrap justify-between items-center">
                        <div class="flex justify-start items-center">
                            <button data-drawer-target="drawer-navigation" data-drawer-toggle="drawer-navigation" aria-controls="drawer-navigation" class="p-2 mr-2 text-acent1 rounded-lg cursor-pointer lg:hidden hover:bg-bgLight focus:bg-bgLight focus:ring-2 focus:ring-acent1">
                                <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="sr-only">Toggle sidebar</span>
                            </button>

                            <a href="/" class="flex items-center justify-between mr-4">
                                <img src="../assets/images/logo.png" class="mr-3 h-8 hidden md:inline" alt="Logo" />
                            </a>

                            <h4 class="hidden lg:block text-base lg:text-2xl font-medium text-primary ml-5">Dashboard</h4>
                        </div>

                        <div class="hidden lg:inline">
                            <h1 class="text-xl md:text-3xl lg:text-5xl font-medium text-primary">ABC Institue Dhaka</h1>
                        </div>

                        <div class="flex items-center gap-3 lg:order-2">
                            <button type="button" data-dropdown-toggle="notification-dropdown" class="flex items-center justify-center relative w-9 h-9 rounded-xl text-acent1 bg-bgLight hover:bg-acent1 hover:text-white focus:bg-acent1 focus:text-white transition-all duration-200">
                                <span class="absolute flex h-5 w-6 -top-2 -right-3">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-acent1 opacity-75"></span>
                                    <span class="relative flex items-center justify-center rounded-full h-6 w-6 bg-acent1 text-[9px] text-white">02</span>
                                </span>
                                <i class="text-lg fa-regular fa-bell"></i>
                            </button>

                            <div class="hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700 rounded-xl" id="notification-dropdown">
                                <h4 class="block py-2 px-4 text-base font-medium text-center text-white bg-acent1">Notifications</h4>
                                <div>
                                    <a href="#" class="flex py-3 px-4 border-b border-gray-300 hover:bg-bgLight">
                                        <div class="flex-shrink-0">
                                            <img class="w-11 h-11 rounded-full object-cover" src="../assets/images/teachers/8.png" alt="Rubel Islam" />
                                        </div>
                                        <div class="pl-3 w-full">
                                            <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                                New message from
                                                <span class="font-semibold text-gray">Rubel Islam</span>: "Create a new class text for class 10."
                                            </div>
                                            <div class="text-xs font-medium text-primary">a few moments ago</div>
                                        </div>
                                    </a>
                                    <a href="#" class="flex py-3 px-4 border-b border-gray-300 hover:bg-bgLight">
                                        <div class="flex-shrink-0">
                                            <img class="w-11 h-11 rounded-full object-cover" src="../assets/images/teachers/8.png" alt="Rubel Islam" />
                                        </div>
                                        <div class="pl-3 w-full">
                                            <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                                New message from
                                                <span class="font-semibold text-gray">Rubel Islam</span>: "Create a new class text for class 10."
                                            </div>
                                            <div class="text-xs font-medium text-primary">a few moments ago</div>
                                        </div>
                                    </a>
                                    <a href="#" class="flex py-3 px-4 border-b border-gray-300 hover:bg-bgLight">
                                        <div class="flex-shrink-0">
                                            <img class="w-11 h-11 rounded-full object-cover" src="../assets/images/teachers/8.png" alt="Rubel Islam" />
                                        </div>
                                        <div class="pl-3 w-full">
                                            <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                                New message from
                                                <span class="font-semibold text-gray">Rubel Islam</span>: "Create a new class text for class 10."
                                            </div>
                                            <div class="text-xs font-medium text-primary">a few moments ago</div>
                                        </div>
                                    </a>
                                    <a href="#" class="flex py-3 px-4 hover:bg-bgLight">
                                        <div class="flex-shrink-0">
                                            <img class="w-11 h-11 rounded-full object-cover" src="../assets/images/teachers/8.png" alt="Rubel Islam" />
                                        </div>
                                        <div class="pl-3 w-full">
                                            <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                                New message from
                                                <span class="font-semibold text-gray">Rubel Islam</span>: "Create a new class text for class 10."
                                            </div>
                                            <div class="text-xs font-medium text-primary">a few moments ago</div>
                                        </div>
                                    </a>
                                </div>
                                <a href="#" class="block py-2 text-md font-medium text-center text-white bg-acent1 hover:bg-secondary">
                                    <div class="inline-flex items-center">
                                        <i class="fa-solid fa-eye mr-2 text-lg text-white"></i>
                                        View all
                                    </div>
                                </a>
                            </div>

                            <button type="button" data-dropdown-toggle="apps-dropdown" class="flex items-center justify-center relative w-9 h-9 rounded-xl text-acent1 bg-bgLight hover:bg-acent1 hover:text-white focus:bg-acent1 focus:text-white transition-all duration-200">
                                <span class="absolute flex h-5 w-6 -top-2 -right-3">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-acent1 opacity-75"></span>
                                    <span class="relative flex items-center justify-center rounded-full h-6 w-6 bg-acent1 text-[9px] text-white">02</span>
                                </span>
                                <i class="fa-solid fa-gear text-lg"></i>
                            </button>

                            <div class="hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white divide-y divide-gray-100 shadow-lg dark:bg-gray-700 dark:divide-gray-600 rounded-xl" id="apps-dropdown">
                                <h4 class="block py-2 px-4 text-base font-medium text-center text-white bg-acent1">Setting</h4>
                                <div class="grid grid-cols-3 gap-4 p-4">
                                    <a href="#" class="block p-4 text-center rounded-lg hover:bg-bgLight transition-all">
                                        <i class="fa-solid fa-graduation-cap text-xl text-acent1"></i>
                                        <div class="text-sm text-gray-900">Student</div>
                                    </a>
                                    <a href="#" class="block p-4 text-center rounded-lg hover:bg-bgLight transition-all">
                                        <i class="fa-solid fa-chalkboard-user text-xl text-acent1"></i>
                                        <div class="text-sm text-gray-900">Teacher</div>
                                    </a>
                                    <a href="#" class="block p-4 text-center rounded-lg hover:bg-bgLight transition-all">
                                        <i class="fa-solid fa-users text-xl text-acent1"></i>
                                        <div class="text-sm text-gray-900">Staff</div>
                                    </a>
                                    <a href="#" class="block p-4 text-center rounded-lg hover:bg-bgLight transition-all">
                                        <i class="fa-solid fa-circle-user text-xl text-acent1"></i>
                                        <div class="text-sm text-gray-900">Profile</div>
                                    </a>
                                    <a href="#" class="block p-4 text-center rounded-lg hover:bg-bgLight transition-all">
                                        <i class="fa-solid fa-gear text-xl text-acent1"></i>
                                        <div class="text-sm text-gray-900">Settings</div>
                                    </a>
                                    <a href="#" class="block p-4 text-center rounded-lg hover:bg-bgLight transition-all">
                                        <i class="fa-solid fa-chart-simple text-xl text-acent1"></i>
                                        <div class="text-sm text-gray-900">Analysis</div>
                                    </a>
                                </div>
                            </div>

                            <button type="button" class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
                                <span class="sr-only">Open user menu</span>
                                <img class="w-8 h-8 rounded-full object-cover" src="https://cdn.pixabay.com/photo/2015/04/13/12/07/business-720429_1280.jpg" alt="user photo" />
                            </button>
                            <div class="hidden z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl" id="dropdown">
                                <div class="py-3 px-4">
                                    <span class="block text-sm font-semibold text-gray-900">Adnan Kabir</span>
                                    <span class="block text-sm text-gray-900 truncate">Admin</span>
                                </div>
                                <ul class="py-1 text-gray-700" aria-labelledby="dropdown">
                                    <li>
                                        <a href="#" class="block py-2 px-4 text-sm hover:bg-bgLight">My profile</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block py-2 px-4 text-sm hover:bg-bgLight">Account settings</a>
                                    </li>
                                </ul>
                                <ul class="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
                                    <li>
                                        <a href="#" class="flex items-center py-2 px-4 text-sm hover:bg-bgLight"><svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                                        </svg>
                                            Shedule</a>
                                    </li>
                                    <li>
                                        <a href="#" class="flex justify-between items-center py-2 px-4 text-sm hover:bg-bgLight">
                                            <span class="flex items-center">
                                                <i class="fa-solid fa-dollar-sign mr-2 text-md text-primary-600 dark:text-primary-500"></i>
                                                Payments
                                            </span>
                                            <i class="fa-solid fa-chevron-right text-base text-gray-400"></i>
                                        </a>
                                    </li>
                                </ul>
                                <ul class="py-1 text-gray-700 dark:text-gray-300" aria-labelledby="dropdown">
                                    <li>
                                        <a href="#" class="block py-2 px-4 text-sm hover:bg-bgLight">Log out</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                <aside class="scrollbar fixed top-0 left-0 z-40 w-72 lg:w-56 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 lg:translate-x-0" aria-label="Sidenav" id="drawer-navigation">
                    <div class="overflow-y-auto py-5 px-3 h-full bg-white">
                        <ul class="space-y-0.5 inline lg:hidden">
                            <li>
                                <a href="index.html" class="flex items-center p-2 text-base font-medium text-primary rounded-lg hover:bg-acent1 group transition duration-75">
                                    <i class="fa-solid fa-house text-lg text-acent1 group-hover:text-white transition duration-75"></i>
                                    <span class="ml-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-teacher" data-collapse-toggle="dropdown-teacher">
                                    <i class="fa-solid fa-chalkboard-user text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Teacher</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-teacher" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li>
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Teacher</a>
                                    </li>
                                    <li data-tab-target="#add_teacher">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Add Teacher</a>
                                    </li>
                                    <li data-tab-target="#teacher_billing">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Teacher Billing</a>
                                    </li>
                                    <li data-tab-target="#upload_data">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Upload From Excel</a>
                                    </li>
                                    <li data-tab-target="#branch_transfer">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Branch Transfer</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-student" data-collapse-toggle="dropdown-student">
                                    <i class="fa-solid fa-graduation-cap text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Student</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-student" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li data-tab-target="#student">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Students</a>
                                    </li>
                                    <li data-tab-target="#change_billing">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Change Billing</a>
                                    </li>
                                    <li data-tab-target="#upload_data">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Upload From Excel</a>
                                    </li>
                                    <li data-tab-target="#admit_tc_report">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Admit and TC Report</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-attendance" data-collapse-toggle="dropdown-attendance">
                                    <i class="fa-solid fa-clipboard-user text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Attendance</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-attendance" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li data-tab-target="#attendance_default">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Attendanace Default</a>
                                    </li>
                                    <li data-tab-target="#attendance_report">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Attendanace Report</a>
                                    </li>
                                    <li data-tab-target="#student_absent_payment">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Student Absent Payment</a>
                                    </li>
                                    <li data-tab-target="#absent_find_sms">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Absent Fine SMS</a>
                                    </li>
                                    <li>
                                        <button type="button" class="flex items-center p-2 w-full text-sm font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="other" data-collapse-toggle="other">
                                            <span class="flex-1 text-left whitespace-nowrap">Other</span>
                                            <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                        </button>
                                        <ul id="other" class="hidden space-y-1 pl-2">
                                            <li>
                                                <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Item</a>
                                            </li>
                                            <li>
                                                <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Item</a>
                                            </li>
                                            <li>
                                                <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Item</a>
                                            </li>
                                            <li>
                                                <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Item</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-exam" data-collapse-toggle="dropdown-exam">
                                    <i class="fa-solid fa-file-pen text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Exam</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-exam" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li data-tab-target="#all_exam">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Exam</a>
                                    </li>
                                    <li data-tab-target="#add_exam">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Add Exam</a>
                                    </li>
                                    <li data-tab-target="#exam_head">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Exam Head</a>
                                    </li>
                                    <li data-tab-target="#exam_sub_head">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Exam Sub-Head</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="subject.html" class="flex items-center p-2 text-base font-medium text-primary rounded-lg hover:bg-acent1 group transition duration-75">
                                    <i class="fa-solid fa-book text-lg text-acent1 group-hover:text-white transition duration-75"></i>
                                    <span class="ml-3">Subject</span>
                                </a>
                            </li>
                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-result" data-collapse-toggle="dropdown-result">
                                    <i class="fa-solid fa-square-poll-vertical text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Result</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-result" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li data-tab-target="#mark_input">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Mark Input</a>
                                    </li>
                                    <li data-tab-target="#mark_view">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Mark View</a>
                                    </li>
                                    <li data-tab-target="#result_view">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Result</a>
                                    </li>
                                    <li data-tab-target="#">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Tabulation</a>
                                    </li>
                                    <li data-tab-target="#">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Result By Student ID</a>
                                    </li>
                                    <li data-tab-target="#">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Commnets Input</a>
                                    </li>
                                    <li data-tab-target="#mark_input_by_excel">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Mark Input By Excel</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-analysis" data-collapse-toggle="dropdown-analysis">
                                    <i class="fa-solid fa-chart-simple text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Mark Analysis</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-analysis" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li data-tab-target="#analysis_default">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Analysis</a>
                                    </li>
                                    <li data-tab-target="#default_list">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Default List</a>
                                    </li>
                                    <li data-tab-target="#merit_list">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Merit List</a>
                                    </li>
                                    <li data-tab-target="#result_analysis">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Resilt Analysis</a>
                                    </li>
                                    <li data-tab-target="#segregation">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Segregation</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1" aria-controls="dropdown-task" data-collapse-toggle="dropdown-task">
                                    <i class="fa-solid fa-thumbtack text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Task</span>
                                    <i class="fa-solid fa-chevron-down text-base font-bold"></i>
                                </button>
                                <ul id="dropdown-task" class="tabs hidden py-2 space-y-1 pl-2">
                                    <li data-tab-target="#home_work">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Home Work</a>
                                    </li>
                                    <li data-tab-target="#exam_routine">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Exam Routine</a>
                                    </li>
                                    <li data-tab-target="#class_routine">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Class Routine</a>
                                    </li>
                                    <li data-tab-target="#syllabus">
                                        <a href="#" class="flex items-center p-2 text-sm font-medium text-primary rounded-lg hover:bg-acent1 hover:text-white group transition duration-75">Sullabus</a>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <a href="setting.html" class="flex items-center p-2 text-base font-medium text-primary rounded-lg hover:bg-acent1 group transition duration-75">
                                    <i class="fa-solid fa-gear text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="ml-3">Setting</span>
                                </a>
                            </li>
                        </ul>

                        <ul class="hidden lg:inline space-y-0.5">
                            <li>
                                <a href="index.html" class="flex items-center p-2 text-base font-medium text-primary rounded-lg hover:bg-acent1 group transition duration-75">
                                    <i class="fa-solid fa-house text-lg text-acent1 group-hover:text-white transition duration-75"></i>
                                    <span class="ml-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="teacher.html" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-chalkboard-user text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Teacher</span>
                                </a>
                            </li>
                            <li>
                                <a href="student.html" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-graduation-cap text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Student</span>
                                </a>
                            </li>
                            <li>
                                <a href="attendance.html" type="button" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-clipboard-user text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Attendance</span>
                                </a>
                            </li>

                            <li>
                                <a href="exam.html" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-file-pen text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Exam</span>
                                </a>
                            </li>
                            <li>
                                <a href="subject.html" class="flex items-center p-2 text-base font-medium text-primary rounded-lg hover:bg-acent1 group transition duration-75">
                                    <i class="fa-solid fa-book text-lg text-acent1 group-hover:text-white transition duration-75"></i>
                                    <span class="ml-3">Subject</span>
                                </a>
                            </li>
                            <li>
                                <a href="result.html" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-square-poll-vertical text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Result</span>
                                </a>
                            </li>
                            <li>
                                <a href="analysis.html" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-chart-simple text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Mark Analysis</span>
                                </a>
                            </li>
                            <li>
                                <a href="task.html" class="flex items-center p-2 w-full text-base font-medium text-primary rounded-lg transition duration-75 group hover:bg-acent1">
                                    <i class="fa-solid fa-thumbtack text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="flex-1 ml-3 text-left whitespace-nowrap">Task</span>
                                </a>
                            </li>
                            <li>
                                <a href="setting.html" class="flex items-center p-2 text-base font-medium text-primary rounded-lg hover:bg-acent1 group transition duration-75">
                                    <i class="fa-solid fa-gear text-lg text-acent1 transition duration-75 group-hover:text-white"></i>
                                    <span class="ml-3">Setting</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-white z-20">
                        <a href="setting.html" data-tooltip-target="tooltip-settings" class="inline-flex w-9 h-9 justify-center items-center bg-bgLight text-acent1 rounded-xl cursor-pointer hover:text-white hover:bg-acent1">
                            <i class="fa-solid fa-gear text-md"></i>
                        </a>
                        <div id="tooltip-settings" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-acent1 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip">
                            Settings page
                            <div class="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <a href="#" data-tooltip-target="tooltip-tutorial" class="inline-flex w-9 h-9 justify-center items-center bg-bgLight text-acent1 rounded-xl cursor-pointer hover:text-white hover:bg-acent1">
                            <i class="fa-solid fa-video text-md"></i>
                        </a>
                        <div id="tooltip-tutorial" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-acent1 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip">
                            Tutorials
                            <div class="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <a href="#" data-tooltip-target="tooltip-support" class="inline-flex w-9 h-9 justify-center items-center bg-bgLight text-acent1 rounded-xl cursor-pointer hover:text-white hover:bg-acent1">
                            <i class="fa-solid fa-headset text-md"></i>
                        </a>
                        <div id="tooltip-support" role="tooltip" class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-acent1 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip">
                            Support
                            <div class="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>
                </aside>

                <main class="flex flex-col gap-4 md:gap-5 px-4 lg:px-5 lg:ml-56 h-auto pt-20 pb-5">

                </main>
            </div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

        </div>
    )
}
