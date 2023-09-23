"use client";

import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  HStack,
  Button,
  Select,
  Input,
  InputRightElement,
  InputGroup,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../../firebase";
import { format } from "date-fns";
import Link from "next/link";

const Top = () => {
  //状態
  const [todos, setTodos] = useState([]);
  //画面遷移用
  const router = useRouter();

  //firebaseからデータを取得する
  useEffect(() => {
    const todoData = collection(db, "posts");
    //Updateを基準に降順で取得
    const q = query(todoData, orderBy("Update", "desc"));
    getDocs(q).then((snapShot) => {
      const getTodoData = snapShot.docs.map((doc) => {
        return {
          Create: format(doc.data().Create.toDate(), "yyyy-MM-dd HH:mm"),
          Detail: doc.data().Detail,
          Id: doc.data().Id,
          Priority: doc.data().Priority,
          Status: doc.data().Status,
          Task: doc.data().Task,
          Update: format(doc.data().Update.toDate(), "yyyy-MM-dd HH:mm"),
        };
      });
      setTodos(getTodoData);
      // console.log(todos);
    });
  }, []);

  //Createページに遷移する関数
  const linkToCreate = () => {
    //useRouterを使用した動的なページネーションの設定
    router.push("/create");
  };

  //Editページに遷移する関数
  const linkToEdit = (Id) => {
    //useRouterを使用した動的なページネーションの設定
    router.push(`/edit/${Id}`);
  };

  //Deleteボタン押下時に動く関数
  const DeleteTodo = (Id) => {
    //firebaseの中のデータを削除する（バック側）
    deleteDoc(doc(db, "posts", Id));
    //表示するための処理（フロント側）
    const deleteTodo = todos.filter((todo) => todo.Id !== Id);
    setTodos(deleteTodo);
  };

  //Priority選択時に動く関数
  const onChangeSubTodoStatus = (Id, e) => {
    //該当するidのデータのPriorityとUpdateを更新する（バック側）
    updateDoc(doc(db, "posts", Id), {
      Priority: e.target.value,
      Update: serverTimestamp(),
    });
    // console.log(Id);
    //該当するidのデータのPriorityとUpdateを更新する（フロント側）
    const stateChangeTodo = todos.map((todo) => {
      return todo.Id === Id
        ? {
            Create: todo.Create,
            Detail: todo.Detail,
            Id: todo.Id,
            Priority: e.target.value,
            Status: todo.Status,
            Task: todo.Task,
            Update: todo.Update,
          }
        : todo;
    });
    setTodos(stateChangeTodo);
  };

  // const btn = document.getElementById("btn");
  // console.log(btn);
  // btn.addEventListener("click", () => {
  //   btn.textContent = "押されました";
  // });

  //Statusボタンを押下時にStatusが変更される
  const onClickChangeStatus = (Id) => {
    //statusの配列を作る
    const status = ["NOT STARTED", "DOING", "DONE"];
    //statusの配列を順番に回す(if文を使う簡単書く量は増える、配列012を使ってfilterかmap関数で回す時の条件statusと配列の内容が一致したら要素が入ってくるlengthを使うとできる、)
    //順番に回したstatusの配列の内容をupdateDocで更新する
  };

  return (
    <>
      {/* 中身 */}
      <Box px={20} py={6}>
        <HStack mb={4}>
          {/* 検索部分 */}
          <HStack spacing={2}>
            {/* SEARCH部分 */}
            <FormControl>
              <FormLabel>SEARCH</FormLabel>
              <InputGroup size="sm">
                <InputRightElement>
                  <IconButton icon={<SearchIcon />} size="sm" />
                </InputRightElement>
                <Input placeholder="タスクを検索" />
              </InputGroup>
            </FormControl>
            {/* SEARCH部分 */}

            {/* STATUS部分 */}
            <FormControl>
              <FormLabel>STATUS</FormLabel>
              <Select placeholder="状態を選択" size="sm">
                <option>未完了</option>
                <option>完了</option>
              </Select>
            </FormControl>
            {/* STATUS部分 */}

            {/* PRIORITY部分 */}
            <FormControl>
              <FormLabel>PRIORITY</FormLabel>
              <Select placeholder="重要度を選択" size="sm">
                <option>高</option>
                <option>中</option>
                <option>低</option>
              </Select>
            </FormControl>
            {/* PRIORITY部分 */}

            {/* RESETボタン */}
            <Box>
              <Button variant="outline" colorScheme="gray" rounded="full">
                RESET
              </Button>
            </Box>
            {/* RESETボタン */}
          </HStack>
          {/* 検索部分 */}

          <Spacer />

          {/* createボタン */}
          <Box>
            <IconButton
              icon={<AddIcon />}
              colorScheme="teal"
              rounded="full"
              mr={2}
              onClick={linkToCreate}
            >
              Task作成
            </IconButton>
          </Box>
          {/* createボタン */}
        </HStack>

        {/* Todoリスト */}
        <TableContainer>
          <Table variant="simple">
            <Thead bgColor="green.300">
              {/* Todoリストのタイトル */}
              <Tr>
                <Th width="40%">Task</Th>
                <Th width="12%">Status</Th>
                <Th width="12%">Priority</Th>
                <Th width="12%">Create</Th>
                <Th width="12%">Update</Th>
                <Th width="12%">Action</Th>
              </Tr>
              {/* Todoリストのタイトル */}
            </Thead>

            {/* Todoリスト */}
            <Tbody>
              {todos.map((todo) => {
                return (
                  <Tr key={todo.Id}>
                    <Td width="40%" p={1}>
                      <Link
                        href={`/show/${todo.Id}`}
                        style={{ cursor: "pointer" }}
                      >
                        {todo.Task}
                      </Link>
                    </Td>
                    <Td width="12%" p={1}>
                      <Button
                        p={2}
                        width={100}
                        fontSize={4}
                        bgColor="green.100"
                        rounded="full"
                        textAlign="center"
                        // id="btn"
                        onClick={() => onClickChangeStatus(todo.Id)}
                      >
                        {todo.Status}
                      </Button>
                    </Td>
                    <Td width="12%" p={1}>
                      <Select
                        size="sm"
                        value={todo.Priority}
                        onChange={(e) => onChangeSubTodoStatus(todo.Id, e)}
                      >
                        <option value="High">High</option>
                        <option value="Middle">Middle</option>
                        <option value="Low">Low</option>
                      </Select>
                    </Td>
                    <Td width="12%" p={2}>
                      {todo.Create}
                    </Td>
                    <Td width="12%" p={2}>
                      {todo.Update}
                    </Td>
                    <Td width="12%" p={1}>
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        ml={4}
                        onClick={() => {
                          linkToEdit(todo.Id);
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        ml={4}
                        onClick={() => {
                          DeleteTodo(todo.Id);
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
            {/* Todoリスト */}

            {/* TODO: ページネーション機能挿入予定 */}
          </Table>
        </TableContainer>
        {/* Todoリスト */}
      </Box>
      {/* 中身 */}
    </>
  );
};

export default Top;
