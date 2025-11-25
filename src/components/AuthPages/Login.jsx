

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUserName] = useState(null);

  return (
    <div className="container">
      <form>
        <textarea
          className="email"
          placedholder="example@gmail.com"
          rows="1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        >
        </textarea>
      </form>

    </div>
  )
}
