export interface Product {
  id: string;
  title: string;
  year: number;
  manufacturer: string;
  player: string;
  grade: string;
  certificationNumber: string;
  currentBid: number;
  reserveMet: boolean;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  status: "live" | "ended";
  watching: number;
  description: string[];
  mainImage: string;
  thumbnails: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
    sales: string;
  };
  shipping: {
    method: string;
    price: number;
    location: string;
  };
  category: {
    main: string;
    sub: string;
  };
}

// Product data for each auction visible on the storefront
export const products: Product[] = [
  {
    id: "mickey-mantle-1952",
    title: "1952 Topps Mickey Mantle #311 PSA 8 NM-MT",
    year: 1952,
    manufacturer: "Topps",
    player: "Mickey Mantle",
    grade: "PSA 8 NM-MT",
    certificationNumber: "42100892",
    currentBid: 145000,
    reserveMet: true,
    timeRemaining: { days: 4, hours: 12, minutes: 33, seconds: 15 },
    status: "live",
    watching: 145,
    description: [
      "This represents a defining moment in hobby history. Presented is an iconic 1952 Topps #311 Mickey Mantle rookie card, graded PSA 8 NM-MT. With vivid coloring, sharp corners, and excellent centering, this example stands among the finest known copies of the most recognizable baseball card in existence.",
      "The surface gloss is exceptional, retaining its original sheen from over 70 years ago. The registration of the image is crisp, showing Mantle's classic portrait in stunning detail against the aquamarine background. Minor wear is only visible under magnification, consistent with the NM-MT grade.",
    ],
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsjlhCTqxfIy6i9AYUtegEayXuaTfDgeDZ_B4_5DsvlifCOHEltl2o7FEc_QJS7jh7L6R8exuxC2vbzHw-ZA-4UJ8YPfV7zaEzidLBqpIohR3zTNtp4blilhug_WiJkHc04XXLFHveCqKqZVGOPB-5mJyY-fAN-IXWg6F_qte6UmumXHzSY8lIk9sYdAYhNNrb5ppWCLlI5d9iGPEX4w48RlQ8K0nZE9gEwmTjgYQMsq7eVFKN2Ik7m7qdBNKBoP8pWENPt_HuBMU",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbw4y0IYorhfiudwzR76tix5PwxgAoP_C_CkbQxCMS5whAUD88lWlvkRqvUgm06ukPRR7zvqIpM7DT-j-iyXAyekBslNwcB6tegxZPDzbx-BVtQM7OE3_1wVyyBZOxytDWx-2xhZdNvL-kkr7v3GoRj35JUgo4VfYmuJoTbwr484KP7qJLFpGL4PwCxwzrvnkbYjZJwtj_kURHxYWRd9fqBpOHlJM6U0q0LBISLJvkdOCoRvNCWjxvpQDIN5rL8Z7mH_r32bObJNk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4RMwYhwd3nmytbb2uFSkd1fhObytfCnQdFi5csUNfdQ0WVjNUdMCH-QsR-N0mQgEfl4-X2osycrlAcf5ereodV7myhkn1CH36E1gXqtyv8sHSn0MR4mF3UXabStS_qaLMtN-toHM94Ser43XY7BstfwXFHhrXRq5DC4KPyTuyphgIEkQG1jDnatultTMSL-HY_2T9nestWEbcxtf749Qomm_WjOtxHQvAcj7G3MkoWCn7atSlf7bT0pH3oh3wQmwY0pnvE1A4zOA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbyk8iUrFALDV-W-54ElJt-DAZTt4senehJ9hRHCO2JT0XExjx7T8vPltiEQHjpdEYAQuDmt1gbcSP0YPKGpXC_TPL8vf_4Bod11SsagHw97XSj_9qjZgNai6bfltvM7v68yfV5KX2ykHq0-hrv6E3_6orfhaSvvcwt56SVR9AStAT_lsQcIT4nf7wSA2gRfqotzT5S1xa8y_137L2M82If9zN5ne2yoazIk0xrGM1JGdV-5h3ZGMp6HYsGOYpGLyL5LtW9aaBtFg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUVxtp_Nf3GA3j68XD3P7YjvQ3CiH3vt9k_Jh4xomWu4SVDqrrpTx3Y9tOch58BErJhUYEp16mOoSMd3ANixrfUZ58FIhS_DT5l4oU1i97tPmc1wMnWpCDg5-twmX4Qfrux7HLG5TsQ9OHHF7_iMXoygwubglj5dxi_6EHb3GxQNNQGzU0VNvxkMOdbQXdeVvZzBHQjgjHpdNqX_0XJLwCn-HzLbg9qGllGfYS3bzUxSz56mErgqDMCs4opUkqCRlew1x7QMpxVL0",
    ],
    seller: {
      name: "VintageVault",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCY_qkeeg5xjGqMA9wv__8F48UI_yLcowxZbFpHGQdXCVqalW3DbR_8wgad4xdCZnBdZzicOtG5FUDUQ1czBttRPR5bbkybV-EcqQyb6EnSNEjLA22S4SiroKQ7Z2gBNugiJoU4xaUnKyFDiOg1OsEe6tgdrprlsMCEN8RA2_sIO__X-SR21RrggozJSGfst5Tvq1i_SxdSbSn_VIR5AwQR0yOQ11hGJjIZ33a3mPH9CcHAZiR8AkYM3naaD69t9id24rX6xb4to80",
      rating: 4.9,
      sales: "1.2k",
    },
    shipping: {
      method: "FedEx Priority Overnight",
      price: 45,
      location: "New York, USA",
    },
    category: {
      main: "Sports Cards",
      sub: "Baseball Cards",
    },
  },
  {
    id: "babe-ruth-1933",
    title: "1933 Goudey Babe Ruth #144 PSA 7 NM",
    year: 1933,
    manufacturer: "Goudey",
    player: "Babe Ruth",
    grade: "PSA 7 NM",
    certificationNumber: "38291045",
    currentBid: 42500,
    reserveMet: true,
    timeRemaining: { days: 2, hours: 4, minutes: 18, seconds: 42 },
    status: "live",
    watching: 98,
    description: [
      "An exceptional example of the legendary 1933 Goudey Babe Ruth #144 card, one of four Ruth cards in this iconic set. This PSA 7 NM specimen showcases the Sultan of Swat in his pinstripe glory against the vibrant yellow background that defines this classic issue.",
      "The card exhibits strong centering, vibrant original colors, and clean surfaces throughout. The corners show only minor wear consistent with the grade, while the edges remain sharp and well-defined. A truly investment-worthy piece of baseball history from the Golden Age.",
    ],
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBNd6J-Gkhws-vsn5jqi2nJzS4AZmizhHlpU5GCSc4DO9sW744eerTfF2br_4jp13w-hfL-oWL1VnODx0fUWYst8-J1C9AZVhGrYW5dcdY9RRDasPSWLLZr3L11n3HMPWK-Xky5TcB5EW01v-LDkowJCHkzg6RmlF2izpxYMw79w4RKgulDymzlOlUPSVUIcZRotzlbGHrDCFVulhoKNj__QaGJTKbt1NZVQ5-K5egtQMyC7VfwW3nqUww6EH4Florsnl6TuQMVUM",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBNd6J-Gkhws-vsn5jqi2nJzS4AZmizhHlpU5GCSc4DO9sW744eerTfF2br_4jp13w-hfL-oWL1VnODx0fUWYst8-J1C9AZVhGrYW5dcdY9RRDasPSWLLZr3L11n3HMPWK-Xky5TcB5EW01v-LDkowJCHkzg6RmlF2izpxYMw79w4RKgulDymzlOlUPSVUIcZRotzlbGHrDCFVulhoKNj__QaGJTKbt1NZVQ5-K5egtQMyC7VfwW3nqUww6EH4Florsnl6TuQMVUM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4RMwYhwd3nmytbb2uFSkd1fhObytfCnQdFi5csUNfdQ0WVjNUdMCH-QsR-N0mQgEfl4-X2osycrlAcf5ereodV7myhkn1CH36E1gXqtyv8sHSn0MR4mF3UXabStS_qaLMtN-toHM94Ser43XY7BstfwXFHhrXRq5DC4KPyTuyphgIEkQG1jDnatultTMSL-HY_2T9nestWEbcxtf749Qomm_WjOtxHQvAcj7G3MkoWCn7atSlf7bT0pH3oh3wQmwY0pnvE1A4zOA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbyk8iUrFALDV-W-54ElJt-DAZTt4senehJ9hRHCO2JT0XExjx7T8vPltiEQHjpdEYAQuDmt1gbcSP0YPKGpXC_TPL8vf_4Bod11SsagHw97XSj_9qjZgNai6bfltvM7v68yfV5KX2ykHq0-hrv6E3_6orfhaSvvcwt56SVR9AStAT_lsQcIT4nf7wSA2gRfqotzT5S1xa8y_137L2M82If9zN5ne2yoazIk0xrGM1JGdV-5h3ZGMp6HYsGOYpGLyL5LtW9aaBtFg",
    ],
    seller: {
      name: "CardKingdom",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCY_qkeeg5xjGqMA9wv__8F48UI_yLcowxZbFpHGQdXCVqalW3DbR_8wgad4xdCZnBdZzicOtG5FUDUQ1czBttRPR5bbkybV-EcqQyb6EnSNEjLA22S4SiroKQ7Z2gBNugiJoU4xaUnKyFDiOg1OsEe6tgdrprlsMCEN8RA2_sIO__X-SR21RrggozJSGfst5Tvq1i_SxdSbSn_VIR5AwQR0yOQ11hGJjIZ33a3mPH9CcHAZiR8AkYM3naaD69t9id24rX6xb4to80",
      rating: 4.8,
      sales: "856",
    },
    shipping: {
      method: "FedEx Priority Overnight",
      price: 35,
      location: "Chicago, USA",
    },
    category: {
      main: "Sports Cards",
      sub: "Baseball Cards",
    },
  },
  {
    id: "jackie-robinson-1948",
    title: "1948 Leaf Jackie Robinson #79 PSA 6 EX-MT",
    year: 1948,
    manufacturer: "Leaf",
    player: "Jackie Robinson",
    grade: "PSA 6 EX-MT",
    certificationNumber: "45892134",
    currentBid: 18200,
    reserveMet: false,
    timeRemaining: { days: 0, hours: 5, minutes: 12, seconds: 33 },
    status: "live",
    watching: 76,
    description: [
      "A historic piece commemorating baseball's integration. This 1948 Leaf Jackie Robinson #79 is Robinson's true rookie card from his inaugural season, capturing the man who broke baseball's color barrier and changed sports history forever.",
      "This PSA 6 EX-MT example displays excellent eye appeal with strong colors and clean surfaces. The card shows Robinson in his classic batting pose, with the distinctive red background that makes this issue immediately recognizable to collectors worldwide.",
    ],
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOol7QDJdkIAeFqLW7NZWFPD27VqeBfdwaK9h0tVN69-XxQfJpIp1JdP6nuXGQfkHc1eVHV8hXmdguLI8EwzD1ytlgCYtGRqjgHImmBA0QxxJkfNDUDAiZ9nxH7wxxVk04Hhzmbtk1N0jAy8MwzTcbdKgQ_tE5oDfYcZX9X7GasBq9cN5pKL3uDDk_st8j_IwTbWuRzrxWQKTyt5mIIJNM6T4xq0v84iSl50NBZxV8Xx4a7dan8C6zCjKwjg3MpyDYkVU6F9KHalk",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOol7QDJdkIAeFqLW7NZWFPD27VqeBfdwaK9h0tVN69-XxQfJpIp1JdP6nuXGQfkHc1eVHV8hXmdguLI8EwzD1ytlgCYtGRqjgHImmBA0QxxJkfNDUDAiZ9nxH7wxxVk04Hhzmbtk1N0jAy8MwzTcbdKgQ_tE5oDfYcZX9X7GasBq9cN5pKL3uDDk_st8j_IwTbWuRzrxWQKTyt5mIIJNM6T4xq0v84iSl50NBZxV8Xx4a7dan8C6zCjKwjg3MpyDYkVU6F9KHalk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4RMwYhwd3nmytbb2uFSkd1fhObytfCnQdFi5csUNfdQ0WVjNUdMCH-QsR-N0mQgEfl4-X2osycrlAcf5ereodV7myhkn1CH36E1gXqtyv8sHSn0MR4mF3UXabStS_qaLMtN-toHM94Ser43XY7BstfwXFHhrXRq5DC4KPyTuyphgIEkQG1jDnatultTMSL-HY_2T9nestWEbcxtf749Qomm_WjOtxHQvAcj7G3MkoWCn7atSlf7bT0pH3oh3wQmwY0pnvE1A4zOA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbyk8iUrFALDV-W-54ElJt-DAZTt4senehJ9hRHCO2JT0XExjx7T8vPltiEQHjpdEYAQuDmt1gbcSP0YPKGpXC_TPL8vf_4Bod11SsagHw97XSj_9qjZgNai6bfltvM7v68yfV5KX2ykHq0-hrv6E3_6orfhaSvvcwt56SVR9AStAT_lsQcIT4nf7wSA2gRfqotzT5S1xa8y_137L2M82If9zN5ne2yoazIk0xrGM1JGdV-5h3ZGMp6HYsGOYpGLyL5LtW9aaBtFg",
    ],
    seller: {
      name: "LegendaryCards",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCY_qkeeg5xjGqMA9wv__8F48UI_yLcowxZbFpHGQdXCVqalW3DbR_8wgad4xdCZnBdZzicOtG5FUDUQ1czBttRPR5bbkybV-EcqQyb6EnSNEjLA22S4SiroKQ7Z2gBNugiJoU4xaUnKyFDiOg1OsEe6tgdrprlsMCEN8RA2_sIO__X-SR21RrggozJSGfst5Tvq1i_SxdSbSn_VIR5AwQR0yOQ11hGJjIZ33a3mPH9CcHAZiR8AkYM3naaD69t9id24rX6xb4to80",
      rating: 4.7,
      sales: "634",
    },
    shipping: {
      method: "FedEx Priority",
      price: 30,
      location: "Los Angeles, USA",
    },
    category: {
      main: "Sports Cards",
      sub: "Baseball Cards",
    },
  },
  {
    id: "hank-aaron-1954",
    title: "1954 Topps Hank Aaron #128 PSA 8 NM-MT",
    year: 1954,
    manufacturer: "Topps",
    player: "Hank Aaron",
    grade: "PSA 8 NM-MT",
    certificationNumber: "52783461",
    currentBid: 32000,
    reserveMet: true,
    timeRemaining: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    status: "ended",
    watching: 112,
    description: [
      "The iconic rookie card of Hammerin' Hank Aaron, baseball's all-time home run king for over three decades. This 1954 Topps #128 captures the young Aaron in his Milwaukee Braves uniform, at the start of what would become one of the greatest careers in baseball history.",
      "Graded PSA 8 NM-MT, this exemplary specimen features razor-sharp corners, pristine surfaces, and vibrant original coloring. The centering is well above average for this notoriously difficult issue. A cornerstone card for any serious vintage baseball collection.",
    ],
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzE2HCyUYdRy3ESTYyopI-Jgvb2VcC1LKoS3CLE8Dn5IGZSd75FsgECuf-UjXJPG3C47EAzh3tmwWrzbwJegowVdx-81mFQMtcSGxZP5GVJN9TmufG-kqA_b5JvtS_JHhcTLE9J6Mo6U8eTRsAN9y_VnLPzCG0FH3wAcgGSe0sGPLd8WX3MeKbjJRNC99WC6c46lTWosQOQREr_eb4nehAPlTrqoO365zN7w9HnmJBKzSvMz-2PwAASpL5vPs1Fxc7k7uyA8Vrb24",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzE2HCyUYdRy3ESTYyopI-Jgvb2VcC1LKoS3CLE8Dn5IGZSd75FsgECuf-UjXJPG3C47EAzh3tmwWrzbwJegowVdx-81mFQMtcSGxZP5GVJN9TmufG-kqA_b5JvtS_JHhcTLE9J6Mo6U8eTRsAN9y_VnLPzCG0FH3wAcgGSe0sGPLd8WX3MeKbjJRNC99WC6c46lTWosQOQREr_eb4nehAPlTrqoO365zN7w9HnmJBKzSvMz-2PwAASpL5vPs1Fxc7k7uyA8Vrb24",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4RMwYhwd3nmytbb2uFSkd1fhObytfCnQdFi5csUNfdQ0WVjNUdMCH-QsR-N0mQgEfl4-X2osycrlAcf5ereodV7myhkn1CH36E1gXqtyv8sHSn0MR4mF3UXabStS_qaLMtN-toHM94Ser43XY7BstfwXFHhrXRq5DC4KPyTuyphgIEkQG1jDnatultTMSL-HY_2T9nestWEbcxtf749Qomm_WjOtxHQvAcj7G3MkoWCn7atSlf7bT0pH3oh3wQmwY0pnvE1A4zOA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbyk8iUrFALDV-W-54ElJt-DAZTt4senehJ9hRHCO2JT0XExjx7T8vPltiEQHjpdEYAQuDmt1gbcSP0YPKGpXC_TPL8vf_4Bod11SsagHw97XSj_9qjZgNai6bfltvM7v68yfV5KX2ykHq0-hrv6E3_6orfhaSvvcwt56SVR9AStAT_lsQcIT4nf7wSA2gRfqotzT5S1xa8y_137L2M82If9zN5ne2yoazIk0xrGM1JGdV-5h3ZGMp6HYsGOYpGLyL5LtW9aaBtFg",
    ],
    seller: {
      name: "HallOfFameCards",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCY_qkeeg5xjGqMA9wv__8F48UI_yLcowxZbFpHGQdXCVqalW3DbR_8wgad4xdCZnBdZzicOtG5FUDUQ1czBttRPR5bbkybV-EcqQyb6EnSNEjLA22S4SiroKQ7Z2gBNugiJoU4xaUnKyFDiOg1OsEe6tgdrprlsMCEN8RA2_sIO__X-SR21RrggozJSGfst5Tvq1i_SxdSbSn_VIR5AwQR0yOQ11hGJjIZ33a3mPH9CcHAZiR8AkYM3naaD69t9id24rX6xb4to80",
      rating: 5.0,
      sales: "2.1k",
    },
    shipping: {
      method: "FedEx Priority Overnight",
      price: 40,
      location: "Atlanta, USA",
    },
    category: {
      main: "Sports Cards",
      sub: "Baseball Cards",
    },
  },
  {
    id: "willie-mays-1951",
    title: "1951 Bowman Willie Mays #305 PSA 7 NM",
    year: 1951,
    manufacturer: "Bowman",
    player: "Willie Mays",
    grade: "PSA 7 NM",
    certificationNumber: "61894523",
    currentBid: 68900,
    reserveMet: true,
    timeRemaining: { days: 1, hours: 8, minutes: 44, seconds: 21 },
    status: "live",
    watching: 134,
    description: [
      "The Say Hey Kid's true rookie card - an absolutely stunning 1951 Bowman Willie Mays #305. This iconic card captures the young Giants outfielder who would go on to become one of the greatest all-around players in baseball history.",
      "This PSA 7 NM example is remarkably well-preserved for its age. The image of Mays is perfectly registered with no print defects. Corners are sharp, edges clean, and the surfaces exhibit excellent gloss. A museum-quality piece that anchors any Hall of Fame collection.",
    ],
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBs2uZDR9KDUNAVXayORHJ7VqIPQydEd7fedYZSc1eU2FFNSZ25i2B9DUDqpJDxCtvpmP1pgi4nQpKsCv6iZRDlYu19YVhxK1WxeNABPlUMBRzaTCZVEdycf0Fpmb0iB_sDLJZDZuhbzloSO-F77u_BQqENfsc13vsfXdE9xm1dx-qoAz2-eZgjr3mt3mYbnnk-3k8Ddc7LYz2oUlnHeKNcaZxVSnIKo-F08Xdl7lOWIsjgrIb4Q-1mEUllTeE6KugbyvOxx7ipX8",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBs2uZDR9KDUNAVXayORHJ7VqIPQydEd7fedYZSc1eU2FFNSZ25i2B9DUDqpJDxCtvpmP1pgi4nQpKsCv6iZRDlYu19YVhxK1WxeNABPlUMBRzaTCZVEdycf0Fpmb0iB_sDLJZDZuhbzloSO-F77u_BQqENfsc13vsfXdE9xm1dx-qoAz2-eZgjr3mt3mYbnnk-3k8Ddc7LYz2oUlnHeKNcaZxVSnIKo-F08Xdl7lOWIsjgrIb4Q-1mEUllTeE6KugbyvOxx7ipX8",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4RMwYhwd3nmytbb2uFSkd1fhObytfCnQdFi5csUNfdQ0WVjNUdMCH-QsR-N0mQgEfl4-X2osycrlAcf5ereodV7myhkn1CH36E1gXqtyv8sHSn0MR4mF3UXabStS_qaLMtN-toHM94Ser43XY7BstfwXFHhrXRq5DC4KPyTuyphgIEkQG1jDnatultTMSL-HY_2T9nestWEbcxtf749Qomm_WjOtxHQvAcj7G3MkoWCn7atSlf7bT0pH3oh3wQmwY0pnvE1A4zOA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbyk8iUrFALDV-W-54ElJt-DAZTt4senehJ9hRHCO2JT0XExjx7T8vPltiEQHjpdEYAQuDmt1gbcSP0YPKGpXC_TPL8vf_4Bod11SsagHw97XSj_9qjZgNai6bfltvM7v68yfV5KX2ykHq0-hrv6E3_6orfhaSvvcwt56SVR9AStAT_lsQcIT4nf7wSA2gRfqotzT5S1xa8y_137L2M82If9zN5ne2yoazIk0xrGM1JGdV-5h3ZGMp6HYsGOYpGLyL5LtW9aaBtFg",
    ],
    seller: {
      name: "GiantsMemories",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCY_qkeeg5xjGqMA9wv__8F48UI_yLcowxZbFpHGQdXCVqalW3DbR_8wgad4xdCZnBdZzicOtG5FUDUQ1czBttRPR5bbkybV-EcqQyb6EnSNEjLA22S4SiroKQ7Z2gBNugiJoU4xaUnKyFDiOg1OsEe6tgdrprlsMCEN8RA2_sIO__X-SR21RrggozJSGfst5Tvq1i_SxdSbSn_VIR5AwQR0yOQ11hGJjIZ33a3mPH9CcHAZiR8AkYM3naaD69t9id24rX6xb4to80",
      rating: 4.9,
      sales: "967",
    },
    shipping: {
      method: "FedEx Priority Overnight",
      price: 50,
      location: "San Francisco, USA",
    },
    category: {
      main: "Sports Cards",
      sub: "Baseball Cards",
    },
  },
  {
    id: "roberto-clemente-1955",
    title: "1955 Topps Roberto Clemente #164 PSA 6 EX-MT",
    year: 1955,
    manufacturer: "Topps",
    player: "Roberto Clemente",
    grade: "PSA 6 EX-MT",
    certificationNumber: "73945612",
    currentBid: 21450,
    reserveMet: true,
    timeRemaining: { days: 0, hours: 4, minutes: 10, seconds: 55 },
    status: "live",
    watching: 89,
    description: [
      "The rookie card of the great Roberto Clemente, a humanitarian and baseball legend. This 1955 Topps #164 captures The Great One in his Pirates uniform, beginning a Hall of Fame career that would inspire generations of players and fans alike.",
      "Graded PSA 6 EX-MT, this card displays strong visual appeal with nice centering and rich, vibrant colors. Clemente's image is crisp and well-registered. Some minor wear consistent with the grade is present, but overall the card presents exceptionally well.",
    ],
    mainImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXQYJiRmSu6FtTB2EA38048gc2PjPrlHW7ce1vu9JY-MEdu2CyU_a1GDfvfDLG2szEWYEvta5kGHKGsfPHBY-Wy8KXseP-CSJMKOBdFHjdJ6TepMHL4Pn_nTYzGNbiLR3haFiViqv5lKUUXUE4NvfsPfJMbHYQjn6ypJbgjf7ECjjVljyUPiWTEz8LFN4KXGgQ6ssx2ZxOFeF2VX6T7G6DxNoOY4SIr38sIVKEnyUc3PfVUQaAZCO147U-QtrfcBZNgCHmly-YfHs",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXQYJiRmSu6FtTB2EA38048gc2PjPrlHW7ce1vu9JY-MEdu2CyU_a1GDfvfDLG2szEWYEvta5kGHKGsfPHBY-Wy8KXseP-CSJMKOBdFHjdJ6TepMHL4Pn_nTYzGNbiLR3haFiViqv5lKUUXUE4NvfsPfJMbHYQjn6ypJbgjf7ECjjVljyUPiWTEz8LFN4KXGgQ6ssx2ZxOFeF2VX6T7G6DxNoOY4SIr38sIVKEnyUc3PfVUQaAZCO147U-QtrfcBZNgCHmly-YfHs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4RMwYhwd3nmytbb2uFSkd1fhObytfCnQdFi5csUNfdQ0WVjNUdMCH-QsR-N0mQgEfl4-X2osycrlAcf5ereodV7myhkn1CH36E1gXqtyv8sHSn0MR4mF3UXabStS_qaLMtN-toHM94Ser43XY7BstfwXFHhrXRq5DC4KPyTuyphgIEkQG1jDnatultTMSL-HY_2T9nestWEbcxtf749Qomm_WjOtxHQvAcj7G3MkoWCn7atSlf7bT0pH3oh3wQmwY0pnvE1A4zOA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbyk8iUrFALDV-W-54ElJt-DAZTt4senehJ9hRHCO2JT0XExjx7T8vPltiEQHjpdEYAQuDmt1gbcSP0YPKGpXC_TPL8vf_4Bod11SsagHw97XSj_9qjZgNai6bfltvM7v68yfV5KX2ykHq0-hrv6E3_6orfhaSvvcwt56SVR9AStAT_lsQcIT4nf7wSA2gRfqotzT5S1xa8y_137L2M82If9zN5ne2yoazIk0xrGM1JGdV-5h3ZGMp6HYsGOYpGLyL5LtW9aaBtFg",
    ],
    seller: {
      name: "PiratesLegacy",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCY_qkeeg5xjGqMA9wv__8F48UI_yLcowxZbFpHGQdXCVqalW3DbR_8wgad4xdCZnBdZzicOtG5FUDUQ1czBttRPR5bbkybV-EcqQyb6EnSNEjLA22S4SiroKQ7Z2gBNugiJoU4xaUnKyFDiOg1OsEe6tgdrprlsMCEN8RA2_sIO__X-SR21RrggozJSGfst5Tvq1i_SxdSbSn_VIR5AwQR0yOQ11hGJjIZ33a3mPH9CcHAZiR8AkYM3naaD69t9id24rX6xb4to80",
      rating: 4.8,
      sales: "445",
    },
    shipping: {
      method: "FedEx Priority",
      price: 35,
      location: "Pittsburgh, USA",
    },
    category: {
      main: "Sports Cards",
      sub: "Baseball Cards",
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(currentId: string, limit = 5): Product[] {
  return products.filter((product) => product.id !== currentId).slice(0, limit);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
