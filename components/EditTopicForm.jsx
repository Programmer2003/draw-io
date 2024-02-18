"use client";

import Menu from "./Menu";
import Toolbox from "./Toolbox";
import Board from "./Board";
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function EditTopicForm({ id, name, canvasFile }) {
  return (
    <Provider store={store}>
      <Menu />
      <Toolbox />
      <Board id={id} name={name} canvasFile={canvasFile} />
    </Provider>
  )
}
