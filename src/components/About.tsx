import useRouter from '../hooks/useRouter';

function About() {
  const { push } = useRouter();

  return (
    <>
      <h1>about</h1>
      <button
        onClick={() => {
          push('/');
        }}
      >
        go main
      </button>
    </>
  );
}

export default About;
