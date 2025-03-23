import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    <FileUploader
      acceptedFileTypes={['image/*']}
      path={({ identityId }) => `protected/${identityId}/`}
      maxFileCount={5}
      isResumable
            components={{
        Container({ children }) {
          return <Card variation="elevated">{children}</Card>;
        },
        // DropZone({ children, inDropZone, onDragEnter, onDragLeave, onDragStart, onDragOver, onDrop }) {
        DropZone({ children, inDropZone, ...rest }) {
          return (
            <Flex
              alignItems="center"
              direction="column"
              padding="medium"
              backgroundColor={inDropZone ? 'primary.10' : ''}
              {...rest}
            >
              <Text>Drop files here</Text>
              <Divider size="small" label="or" maxWidth="10rem" />
              {children}
            </Flex>
          );
        },
        FilePicker({ onClick }) {
          return (
            <Button variation="primary" onClick={onClick}>
              Browse Files
            </Button>
          );
        },
        FileList({ files, onCancelUpload, onDeleteUpload }) {
          return (
            <Flex direction="row">
              {files.map(({ file, key, progress, id, status, uploadTask }) =>
                !file ? null : (
                  <Flex
                    key={key}
                    justifyContent="center"
                    alignItems="center"
                    width="5rem"
                    height="5rem"
                    position="relative"
                  >
                    <Image
                      borderRadius="small"
                      height="100%"
                      objectFit="cover"
                      src={URL.createObjectURL(file)}
                      alt={key}
                    />
                    {progress === 100 ? null : (
                      <Loader
                        position="absolute"
                        size="large"
                        percentage={progress}
                        isDeterminate
                        isPercentageTextHidden
                      />
                    )}

                    <Button
                      opacity="50"
                      borderRadius="xxl"
                      backgroundColor="background.primary"
                      position="absolute"
                      variation="link"
                      size="small"
                      onClick={() => {
                        if (uploadTask && status === 'uploading') {
                          onCancelUpload({ id, uploadTask });
                        } else {
                          onDeleteUpload({ id });
                        }
                      }}
                    >
                      <Icon
                        fontSize="large"
                        color="font.error"
                        viewBox={{ width: 512, height: 512 }}
                        paths={[
                          {
                            d: 'M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z',
                            strokeWidth: '32',
                            fill: 'none',
                            strokeMiterlimit: '10',
                            stroke: 'currentColor',
                          },
                          {
                            d: 'M320 320L192 192m0 128l128-128',
                            strokeWidth: '32',
                            fill: 'none',
                            strokeLinecap: 'round',
                            stroke: 'currentColor',
                          },
                        ]}
                      />
                    </Button>
                  </Flex>
                )
              )}
            </Flex>
          );
        },
      }}
    />
    <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
