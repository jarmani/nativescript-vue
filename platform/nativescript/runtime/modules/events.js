import { updateListeners } from 'core/vdom/helpers/update-listeners'

let target

function createOnceHandler(event, handler, capture) {
  const _target = target // save current target element in closure
  return function onceHandler() {
    const res = handler.apply(null, arguments)
    if (res !== null) {
      remove(event, onceHandler, capture, _target)
    }
  }
}

function add(event, handler, once, capture) {
  if (capture) {
    console.log('NativeScript-Vue do not support event in bubble phase.')
    return
  }
  if (once) {
    const oldHandler = handler
    handler = (...args) => {
      const res = oldHandler.call(null, ...args)
      if (res !== null) {
        remove(event, null, null, target)
      }
    }
  }
  target.addEventListener(event, handler)
}

function remove(event, handler, capture, _target = target) {
  _target.removeEventListener(event)
}

function updateDOMListeners(oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  target = vnode.elm
  updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)
  target = undefined
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}
