const useRouter = () => {
  const push = (path: string) => {
    history.pushState(null, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  return { push }
}

export default useRouter
