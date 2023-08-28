import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Modal from '../components/Modal'
import Plans from '../components/Plans'
import Row from '../components/Row'
import useAuth from '../hooks/useAuth'
import useList from '../hooks/useList'
import useSubscription from '../hooks/useSubscription'
import payments from '../lib/stripe'
import { Movie } from '../typings'
import requests from '../utils/requests'

interface Props {
  netflixOriginals: Movie[]
  trendingNow: Movie[]
  topRated: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaries: Movie[]
  products: Product[]
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  const { loading, user } = useAuth()
  const showModal = useRecoilValue(modalState)
  const subscription = useSubscription(user)
  const movie = useRecoilValue(movieState)
  const list = useList(user?.uid)

  if (loading || subscription === null) return null

  if (!subscription) return <Plans products={products} />

  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${
        showModal && '!h-screen overflow-hidden'
      }`}
    >
      <Head>
        <title>Home - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List Component */}
          {list.length > 0 && <Row title="My List" movies={list} />}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  console.log('Fetching products...');

  try {
    const products = await getProducts(payments, {
      includePrices: true,
      activeOnly: true,
    });

    console.log('Fetched products:', products);

    const movieFetches = [
      requests.fetchNetflixOriginals,
      requests.fetchTrending,
      requests.fetchTopRated,
      requests.fetchActionMovies,
      requests.fetchComedyMovies,
      requests.fetchHorrorMovies,
      requests.fetchRomanceMovies,
      requests.fetchDocumentaries,
    ];

    const movieResponses = await Promise.all(movieFetches.map((url) => {
      console.log('Fetching:', url);
      return fetch(url);
    }));
    
    const movieData = await Promise.all(movieResponses.map(async (response) => {
      console.log('Response:', response);
      const data = await response.json();
      console.log('Parsed Data:', data);
      return data;
    }));

    const [
      netflixOriginals,
      trendingNow,
      topRated,
      actionMovies,
      comedyMovies,
      horrorMovies,
      romanceMovies,
      documentaries,
    ] = movieData;

    return {
      props: {
        netflixOriginals: netflixOriginals?.results || [],
        trendingNow: trendingNow?.results || [],
        topRated: topRated?.results || [],
        actionMovies: actionMovies?.results || [],
        comedyMovies: comedyMovies?.results || [],
        horrorMovies: horrorMovies?.results || [],
        romanceMovies: romanceMovies?.results || [],
        documentaries: documentaries?.results || [],
        products,
      },
    };
  } catch (error) {
    console.log('Error fetching data:');

    return {
      props: {
        netflixOriginals: [],
        trendingNow: [],
        topRated: [],
        actionMovies: [],
        comedyMovies: [],
        horrorMovies: [],
        romanceMovies: [],
        documentaries: [],
        products: [],
      },
    };
  }
}