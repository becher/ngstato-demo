import { createStore, optimistic, connectDevTools, devTools } from '@ngstato/core'
import { StatoStore } from '@ngstato/angular'

// ─── INTERFACE ────────────────────────────────────────

export interface Todo {
  id:   number
  text: string
  done: boolean
}

// ─── STORE ────────────────────────────────────────────

function createTodoStore() {
  const store = createStore({
    // ── State ──
    todos:   [] as Todo[],
    loading: false,
    filter:  'all' as 'all' | 'active' | 'completed',

    // ── Computed (memoized) ──
    computed: {
      total:     (s: any) => s.todos.length,
      remaining: (s: any) => s.todos.filter((t: Todo) => !t.done).length,
      completed: (s: any) => s.todos.filter((t: Todo) =>  t.done).length,

      filteredTodos: (s: any) => {
        switch (s.filter) {
          case 'active':    return s.todos.filter((t: Todo) => !t.done)
          case 'completed': return s.todos.filter((t: Todo) =>  t.done)
          default:          return s.todos
        }
      }
    },

    // ── Actions ──
    actions: {
      async loadTodos(state: any) {
        state.loading = true
        await new Promise(r => setTimeout(r, 600))
        state.todos = [
          { id: 1, text: '✅ Learn ngStato — async/await state management', done: true },
          { id: 2, text: '🔄 Replace NgRx — 12x smaller, same features',    done: false },
          { id: 3, text: '📦 Publish to npm — v0.4.0 with time-travel',      done: false },
          { id: 4, text: '⚡ Add concurrency helpers — exclusive, queued',   done: false },
          { id: 5, text: '🧪 Write tests with createMockStore()',            done: false },
        ]
        state.loading = false
      },

      addTodo(state: any, text: string) {
        if (!text.trim()) return
        state.todos = [...state.todos, {
          id:   Date.now(),
          text: text.trim(),
          done: false
        }]
      },

      toggleTodo(state: any, id: number) {
        state.todos = state.todos.map((t: Todo) =>
          t.id === id ? { ...t, done: !t.done } : t
        )
      },

      // Optimistic delete — instant UI update, rollback on failure
      deleteTodo: optimistic(
        (state: any, id: number) => {
          state.todos = state.todos.filter((t: Todo) => t.id !== id)
        },
        async (_: any, id: number) => {
          await new Promise(r => setTimeout(r, 300))
          // In production: await http.delete(`/todos/${id}`)
        }
      ),

      setFilter(state: any, filter: 'all' | 'active' | 'completed') {
        state.filter = filter
      },

      clearCompleted(state: any) {
        state.todos = state.todos.filter((t: Todo) => !t.done)
      }
    },

    // ── Hooks ──
    hooks: {
      onActionDone: (name: string, ms: number) => {
        console.log(`[TodoStore] ${name} — ${ms}ms`)
      }
    }
  })

  // DevTools with time-travel 🕹️
  connectDevTools(store, 'TodoStore')
  return store
}

// ─── ANGULAR SERVICE ──────────────────────────────────
// StatoStore() auto-creates an Injectable with Signals

export const TodoStore = StatoStore(() => createTodoStore())
