const login = document.querySelector(".login");
const signUp = document.querySelector(".signUp");
const todoList=document.querySelector(".todoList");
const changeLogin = document.querySelector("#changeLogin");
const changeSignUp = document.querySelector("#changeSignUp");
const list=document.querySelector(".list");
const rightName=document.querySelector(".rightName");
const apiUrl="https://todoo.5xcamp.us";

const allList=document.querySelector(".allList");
const allListPage=document.querySelector(".allListPage");
const UnFinish=document.querySelector(".UnFinish");
const UnFinishPage=document.querySelector(".UnFinishPage");
const finish=document.querySelector(".finish");
const finishPage=document.querySelector(".finishPage");

//重新整理載入已儲存的 token&nickname
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const nickname = localStorage.getItem('nickname');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        rightName.textContent = `${nickname}的待辦`;
        login.classList.add("none");
        signUp.classList.add("none");
        todoList.classList.remove("none");
        getTodoData();
        allListPage.classList.remove("none");
        UnFinishPage.classList.add("none");
        finishPage.classList.add("none");

    } else {
        login.classList.remove("none");
        signUp.classList.add("none");
        todoList.classList.add("none");
    }
});

//轉換註冊及登入頁面
changeLogin.addEventListener("click",changePage);
changeSignUp.addEventListener("click",changePage);
function changePage(e){
    if (e.target.id === "changeSignUp") {
        login.classList.add("none");
        signUp.classList.remove("none");
    } else if (e.target.id === "changeLogin") {
        signUp.classList.add("none");
        login.classList.remove("none");
    }
}

const todoListPage=document.querySelector(".todoListPage");
const noDataPage=document.querySelector(".noDataPage");
const unFinishLimit=document.querySelector(".unFinishLimit");
let data=[];
let limit=0;
function getTodoData(){
    
    axios.get(`${apiUrl}/todos`,{})
    .then(
        res =>{
            data=res.data.todos;
            renderData();
            if (data.length === 0) {
                noDataPage.classList.remove("none");
                todoListPage.classList.add("none");
            } else {
                noDataPage.classList.add("none");
                todoListPage.classList.remove("none");
                
            }
            limit = data.filter(item => item.completed_at == null).length;
            unFinishLimit.innerHTML = `${limit}個待完成項目`;
        }
    )
    .catch(
        error => {
            alert(error.response.data.message);
        }
    )
    
}

//渲染出 todoList
function renderData() {
    let allStr = "";
    let unFinishStr = "";
    let finishStr = "";
    data.forEach((item) => {
        const itemHtml = `<li> 
            <input type="checkbox" data-check=${item.id} ${item.completed_at ? 'checked' : ''} >
            <label  class="${item.completed_at ? 'checked' : 'Uncheck'}">${item.content}</label>
            <a href="#" class="delete" data-num=${item.id}></a>
        </li>`;
        //第一個判斷式 check = checkbox 勾選  //第二個判斷式 check = css.checked 刪除線
        if (item.completed_at != null){
            finishStr += itemHtml;
        } 
        else {
            unFinishStr += itemHtml;
        }
        allStr += itemHtml;
    });
    allListPage.innerHTML = allStr;
    UnFinishPage.innerHTML = unFinishStr;
    finishPage.innerHTML = finishStr;
}

//登入功能
const loginPageEmail=document.querySelector(".loginPageEmail");
const loginPagePassword=document.querySelector(".loginPagePassword");
const loginBtn=document.querySelector(".loginBtn");
loginBtn.addEventListener("click",memberLogin);

function memberLogin(){
    if(loginPageEmail.value==="" || loginPagePassword.value==="")
        {
            alert("請填入資訊,不得為空");
            return;
        }
    else
    axios.post(`${apiUrl}/users/sign_in`,{    
        "user": {
            "email":loginPageEmail.value ,
            "password": loginPagePassword.value,
            }
    })
    .then(
        res => { 
            if (res.data.message === "登入成功") {
            const token = res.headers.authorization;
            const nickname = res.data.nickname;
            localStorage.setItem('authToken', token);
            localStorage.setItem('nickname', nickname);
            axios.defaults.headers.common['Authorization'] = token;
            login.classList.add("none");
            signUp.classList.add("none");
            todoList.classList.remove("none");
            rightName.textContent = `${res.data.nickname}的待辦`;
            getTodoData();
            allListPage.classList.remove("none");
            UnFinishPage.classList.add("none");
            finishPage.classList.add("none");
            }
    })
    .catch( 
        error => {
            alert(error.response.data.message);
    });
    loginPageEmail.value="";
    loginPagePassword.value="";
}

//註冊功能
const signUpEmail=document.querySelector(".signUpEmail");
const signUpName=document.querySelector(".signUpName");
const signUpPassword=document.querySelector(".signUpPassword");
const signUpCheckPassword=document.querySelector(".signUpCheckPassword");
const signUpBtn=document.querySelector(".signUpBtn");
signUpBtn.addEventListener("click",memberSignUp)

function memberSignUp(){
    if(signUpEmail.value==="" || 
        signUpName.value==="" || 
        signUpPassword.value==="" || 
        signUpCheckPassword.value==="")
        {
            alert("請填入資訊,不得為空");
            return;
        }
    else if (signUpCheckPassword.value!==signUpPassword.value)
        {
            alert("密碼不一致");
            signUpPassword.value="";
            signUpCheckPassword.value="";
            return;
        }
        
    else
        axios.post(`${apiUrl}/users`,{    
            "user":{
                "email": signUpEmail.value,
                "nickname": signUpName.value,
                "password": signUpPassword.value
                }
        })
        .then(
            res => { 
                if (res.data.message === "註冊成功") {
                    alert("註冊成功");
                    signUp.classList.add("none");
                    login.classList.remove("none");
                    signUpEmail.value="";
                    signUpName.value="";
                    signUpPassword.value="";
                    signUpCheckPassword.value="";
                }
        })
        .catch( 
            error => {
                    //alert(error.response.data.message);
                    alert(error.response.data.error[0]);
                    signUpEmail.value="";
                    signUpName.value="";
                    signUpPassword.value="";
                    signUpCheckPassword.value="";
        });
}

//登出功能
const logoutBtn=document.querySelector(".logoutBtn");
logoutBtn.addEventListener("click",memberLogout);

function memberLogout(){
    axios.delete(`${apiUrl}/users/sign_out`,{
        // headers:{
        //     'Authorization':token
        // }
    })
    .then(
        res => { 
            if (res.data.message === "已登出") {
                alert("已登出");
                login.classList.remove("none");
                signUp.classList.add("none");
                todoList.classList.add("none");
            }
    })
    .catch( 
        error => {
            alert(error.response.data.message);
    })
    delete axios.defaults.headers.common['Authorization'];//清除全域token
    localStorage.removeItem('authToken');
    localStorage.removeItem('nickname');
}

//新增代辦
const addBtn=document.querySelector(".addBtn");
const enterBar=document.querySelector(".enterBar")
addBtn.addEventListener("click",AddTodoList);

function AddTodoList(){
    if(enterBar.value==="")
        {
            alert("請輸入待辦事項");
            return;
        }
    else
    axios.post(`${apiUrl}/todos`,{
        "todo": {
            "content": enterBar.value
        }
    })
    .then(
        res =>{
            //alert("新增成功")
            getTodoData(); 
            enterBar.value="";
        }
    )
    .catch(
        error => {
            alert(error.response.data.message);
        }
    )
}


//刪除代辦
list.addEventListener("click",function(e){
    if(e.target.getAttribute("class")!=="delete"){
        //alert("錯誤"); //如果抓到的class 不是delete 就噴錯&中斷
        return;
        }
        let id=e.target.getAttribute("data-num");//抓取 data-num 的num
        removeTodoFun(id)
})
function removeTodoFun(id){
    axios.delete(`${apiUrl}/todos/${id}`,{})
    .then(
        res =>{
            getTodoData();
        }
    )
    .catch(
        error => {
            alert(error.response.data.message);
        }
    )
}

//勾選完成API
list.addEventListener("click",function (e){
    if(e.target.getAttribute("type")!=="checkbox"){
        //console.log("ERROR"); 
        return;
        }
    let id=e.target.getAttribute("data-check");
    axios.patch(`${apiUrl}/todos/${id}/toggle`,{})
    .then(
        res =>{
            getTodoData();
        }
    )
    .catch(
        error => {
            alert(error.response.data.message);
        }
    )
})

//切換全部
allList.addEventListener("click",allListFun)
function allListFun(){
    getTodoData();
    allListPage.classList.remove("none");
    allList.classList.add("active")
    finish.classList.remove("active")
    UnFinish.classList.remove("active")
    UnFinishPage.classList.add("none");
    finishPage.classList.add("none");
}
//切換待完成
UnFinish.addEventListener("click",UnFinishFun)
function UnFinishFun(){
    getTodoData();
    allListPage.classList.add("none");
    allList.classList.remove("active")
    finish.classList.remove("active")
    UnFinish.classList.add("active")
    UnFinishPage.classList.remove("none");
    finishPage.classList.add("none");
}
//切換已完成
finish.addEventListener("click",finishFun)
function finishFun(){
    getTodoData();
    allListPage.classList.add("none");
    allList.classList.remove("active")
    finish.classList.add("active")
    UnFinish.classList.remove("active")
    UnFinishPage.classList.add("none");
    finishPage.classList.remove("none");
}

//清除已完成項目
const clearAllBtn=document.querySelector(".clearAllBtn")
clearAllBtn.addEventListener("click",clearAllFun)
function clearAllFun(){
    data.forEach((item) => {
            if (item.completed_at !== null) {
                removeTodoFun(item.id);
            }
        }
    )
}

//登入ENTER
loginPagePassword.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        memberLogin();
    }
});