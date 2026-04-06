import { Component, OnInit } from '@angular/core'
import { CommonModule }      from '@angular/common'
import { FormsModule }       from '@angular/forms'
import { injectStore, StatoDevToolsComponent } from '@ngstato/angular'
import { TodoStore }         from './todo.store'

@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [CommonModule, FormsModule, StatoDevToolsComponent],
  templateUrl: './app.component.html',
  styleUrl:    './app.component.css'
})
export class AppComponent implements OnInit {
  store   = injectStore(TodoStore)
  newTodo = ''

  async ngOnInit() {
    await this.store.loadTodos()
  }

  async onAdd() {
    const text = this.newTodo.trim()
    if (!text) return
    await this.store.addTodo(text)
    this.newTodo = ''
  }
}
