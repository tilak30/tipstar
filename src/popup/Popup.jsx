import { useEffect, useState, useMemo } from 'react';
import { Button, Heading, VStack, Input, ButtonGroup, Text, chakra } from '@chakra-ui/react'
import browser from "webextension-polyfill";
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://xjspnyouxerhyrahxszg.supabase.co'
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODQ0ODkwNSwiZXhwIjoxOTU0MDI0OTA1fQ.J5E5yqcloTfAoc-VKvJLQl2KIcoAti-_ROR5U-SNJKo'
const supabase = createClient(supabaseUrl, publicAnonKey)

export function Popup() {
  const [user, setUser] = useState("");
  useEffect(() => {
    browser.storage.local.get("user").then(({ user }) => {
      console.log({ user })
      setUser(user)
    })
  }, [])

  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/startpayment" element={<StartPayment />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </MemoryRouter>
  )
}

function MainPage() {
  const navigate = useNavigate();
  const [currentUrl, setCurrentUrl] = useState("")
  const [session, setSession] = useState(null)

  useEffect(() => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      setCurrentUrl(tabs[0].url ?? "blank")
    })
  }, []);

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  function support() {
    if (session) {
      // continue
      navigate(`/startpayment?currentUrl=${currentUrl}`)
    } else {
      navigate("/login")
    }
  }

  //start

  return (
    <VStack p={4}>
      <Heading>tipstar</Heading>
      <p>You're currenly on: {currentUrl}</p>
      <p>Session: {session ? session.user.email : "Not logged in"}</p>
      <Button colorScheme='blue' w="full" onClick={() => support()}>Support this site</Button>
    </VStack>
  );
};

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function savelogin(user, session) {
    return browser.storage.local.set({ user: { user, session } })
  }

  async function login() {
    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password
    })

    console.log({ user, session, error })

    if (!error) {
      await savelogin(user, session)
      navigate("/")
    }
  }

  return (
    <VStack p={4}>
      <Heading>tipstar</Heading>
      <p>Login to continue...</p>
      <Input type="email" placeholder="Your Email" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password here" variant="outline" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={() => login()} colorScheme="blue" w="full">Login</Button>
      <Button variant="outline" w="full" onClick={() => navigate('/signup')}>Not a user? Signup</Button>
    </VStack>
  )
}

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup() {
    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    console.log({ user, session, error })
    if (!error) {
      navigate("/login");
    }
  }

  return (
    <VStack p={4}>
      <Heading>tipstar</Heading>
      <p>SignUp to continue...</p>
      <Input type="email" placeholder="Your Email" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password here" variant="outline" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={() => signup()} colorScheme="blue" w="full">SignUp</Button>
      <Button variant="outline" w="full" onClick={() => navigate('/login')}>Login</Button>
    </VStack>
  )
}

function StartPayment() {
  const { search } = useLocation();
  const currentUrl = useMemo(() => new URLSearchParams(search).get("currentUrl"), [search])
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");

  const getLink = () => {
    console.log('Amount:', amount);
    navigate(`/payment?amount=${amount}`)
  }

  return (
    <VStack p={4}>
      <Heading>tipstar</Heading>
      <p>Support this site...</p>
      <Text fontSize='lg'>Pay to: <span style={{ fontSize: "1rem" }}>{currentUrl}</span></Text>
      <Text fontSize='lg'>Amount: </Text>
      <ButtonGroup variant='outline' spacing='2'>
        <Button colorScheme='blue' onClick={(e) => setAmount(50)}>₹50</Button>
        <Button colorScheme='blue' onClick={(e) => setAmount(100)}>₹100</Button>
        <Button colorScheme='blue' onClick={(e) => setAmount(500)}>₹500</Button>
      </ButtonGroup>
      <Input placeholder="custom" type="number" onChange={(e) => setAmount(e.target.value)} value={amount} />
      <Button onClick={() => getLink()} colorScheme="green" w="full">Get Link to pay</Button>
    </VStack>
  )
}

function Payment() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const amount = useMemo(() => new URLSearchParams(search).get("amount"), [search])

  const [paymentLink, setPaymentLink] = useState("")

  useEffect(() => {
    // razorpay payment link
    setPaymentLink("https://rzp.io/l/CiOjnII")
  }, [amount])

  return (
    <VStack p={4}>
      <Heading>tipstar</Heading>
      <p>Support this site...</p>
      <Text color='green' fontSize='lg'>Pay using this link</Text>
      <Text fontSize='lg'>{paymentLink}</Text>
      <chakra.a href={paymentLink} target="_blank" rel="noreferrer" w="full">
        <Button w="full" colorScheme="green">Pay</Button>
      </chakra.a>
      <Button w="full" variant="outline" colorScheme="red" onClick={() => navigate('/')}>Back to home</Button>
    </VStack>
  )
}