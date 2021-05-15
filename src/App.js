import React, {Component} from "react";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            newTask: {
                content: "",
                isDone: false,
                type: "Work",
            },
            filteredTasks: {
                work: [],
                family: [],
                personal: [],
                business: [],
            },
            filter: "AllTypes"
        }
    }

    // Методы прослушивания изменений
    changeTypeOfTask = (newType) => {
        this.setState({...this.state, newTask: {...this.state.newTask, type: newType.target.value}})
    }

    changeContentOfTask = (newContent) => {
        this.setState({...this.state, newTask: {...this.state.newTask, content: newContent.target.value}})
    }

    changeFilterSettings = (typeOfTask) => {
        this.setState({...this.state, filter: typeOfTask.target.value})
    }

    // Добавляем новую таску
    addNewTask = () => {
        let newTaskInfo = this.state;
        let newContent = {...this.state.newTask, key: Symbol(this.content)}
        newTaskInfo.tasks.push(newContent);
        this.filterTask(newContent, newContent.type);

        this.setState({
            ...newTaskInfo, newTask: {
                content: "",
                isDone: false,
                type: "Work",
            }
        })
    }

    // Фильтруем таски по типу

    filterTask = (obj, typeOfTask) => {
        let clone = {...this.state.filteredTasks};
        let result = (typeOfTask === "Work") ? clone.work : (typeOfTask === "Family") ? clone.family : (typeOfTask === "Personal") ? clone.personal : clone.business;
        result.push(obj);
        this.setState({...this.state, filteredTasks: clone})
    }

    // Функция глубокого копирования для отфильтрованных тасок

    deepClone = (obj) => {
        const cloneObj = {};
        for (const i in obj) {
            if (obj[i] instanceof Object && !(obj[i] instanceof Array)) {
                cloneObj[i] = this.deepClone(obj[i]);
                continue;
            }
            cloneObj[i] = obj[i];
        }

        return cloneObj;
    }

    // Удаление тасок из основного массива (tasks) и отфильрованных массивов по key

    deleteTask = (arr, key) => {
        let obj = this.state.filteredTasks;
        // let result = JSON.parse(JSON.stringify(obj)); Не читает метод Symbol, нет возможности сравнить ключи
        let result = this.deepClone(obj);
        if (Object.keys(obj.work).length !== 0 || Object.keys(obj.family).length !== 0 || Object.keys(obj.personal).length !== 0 || Object.keys(obj.business).length !== 0) {
            for (let item of Object.keys(result)) {
                result[item] = result[item].filter(e => {
                    return (e.key === key) ? 0 : 1
                })
            }
        }

        this.setState({
            ...this.state, tasks: arr.filter(e => {
                return (e.key === key) ? 0 : 1
            }), filteredTasks: result,
        })

    }

    toggleDoneTask = (arr, key) => {
        let obj = this.state.filteredTasks;
        let result = this.deepClone(obj);

        for (let item of Object.keys(result)) {
            result[item] = result[item].map(e => {
                return (e.key === key) ? {
                    ...e,
                    isDone: !e.isDone
                } : {...e}
            })
        }

        this.setState({
            ...this.state, tasks: arr.map(e => {
                return (e.key === key) ? {
                    ...e,
                    isDone: !e.isDone
                } : {...e}
            })
        })
    }

    // Создание разметки

    generateTaskMethod = (arr) => {
        return arr.map(e => {
            return (
                <div className="todo__item">
                    <span className="todo__item-name"
                          style={(e.isDone) ? {textDecoration: "line-through"} : {}}>{e.content}</span>
                    <span onClick={() => this.deleteTask(arr, e.key)}
                          className="todo__item-btn btn btn--red btn--small btn--rounded">delete</span>
                    {(e.isDone) ? <span onClick={() => this.toggleDoneTask(arr, e.key)}
                                        className="todo__item-btn btn btn--disabled btn--small btn--rounded">reversal</span> :
                        <span onClick={() => this.toggleDoneTask(arr, e.key)}
                              className="todo__item-btn btn btn--blue btn--red btn--small btn--rounded">done</span>}
                </div>
            )
        })
    }


    render() {
        return (
            <div className="todo__body">
                <h1 className="todo__title">Todo list</h1>

                <div className="todo__header">
                    <div className="todo__filter">
                        <select onChange={this.changeFilterSettings} defaultValue="AllTypes"
                                className="todo__filter-type" required>
                            <option value="AllTypes">All types</option>
                            <option value="Work">Work</option>
                            <option value="Family">Family</option>
                            <option value="Personal">Personal</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                </div>

                <div className="todo__content">
                    <div className="todo__content-items">
                        {(this.state.filter === "AllTypes") ? this.generateTaskMethod(this.state.tasks) : (this.state.filter === "Work") ? this.generateTaskMethod(this.state.filteredTasks.work) : (this.state.filter === "Family") ? this.generateTaskMethod(this.state.filteredTasks.family) : (this.state.filter === "Personal") ? this.generateTaskMethod(this.state.filteredTasks.personal) : this.generateTaskMethod(this.state.filteredTasks.business)}
                    </div>
                </div>

                <div className="todo__footer">
                    <div className="todo__add-item">
                        <input className="todo__add-value" onChange={this.changeContentOfTask} type="text"
                               value={this.state.newTask.content}/>
                        <select defaultValue="Work" onChange={this.changeTypeOfTask} className="todo__add-type">
                            <option value="Work">Work</option>
                            <option value="Family">Family</option>
                            <option value="Personal">Personal</option>
                            <option value="Business">Business</option>
                        </select>
                        <button onClick={this.addNewTask}
                                className="btn btn--blue btn--red btn--small btn--rounded">Add
                        </button>
                    </div>

                    <div className="todo__used">
                        Used: React: {React.version} | node-sass: 4.14.1
                    </div>

                </div>
            </div>
        )
    }
}

export default Test