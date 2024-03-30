import { gql, useQuery } from "@apollo/client";

const getUsers = gql`
  query GetUsers {
    getUsers {
      name
      username
    }
    getPosts {
      title
      body
    }
  }
`;
function App() {
  const { data, isLoading, error } = useQuery(getUsers);
  return <>

    <div className="container mx-5 md:mx-auto mt-5 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-10">Users list showing with Graph QL</h1>
      {isLoading ? <>
        <h4>Loading</h4>
      </> : <>
        {data?.getUsers?.map((user, index) => (
          <div key={index} className="shadow-sm py-5 px-4 hover:bg-slate-900 hover:text-white  my-2 transition-all ease-in-out duration-300 hover:-translate-y-3">
            <h1 className="font-medium">{user.name} <sup className="text-pretty">{user.username}</sup></h1>
          </div>
        ))}
      </>}
    </div>
  </>;
}

export default App;
