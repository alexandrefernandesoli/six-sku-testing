const PARAMETER_OPTIONS = {
  rede: [
    { value: "1", label: "CALLCENTER" },
    { value: "2", label: "FACEBOOK" },
    { value: "3", label: "YOUTUBE" },
    { value: "4", label: "SEARCH" },
    { value: "5", label: "NATIVE" },
    { value: "6", label: "AFILIADOS" },
    { value: "7", label: "EMAIL" },
    { value: "8", label: "SMS" },
  ],
  vsl: Array.from({ length: 11 }, (_, i) => ({
    value: String(i),
    label: i === 0 ? "CALLCENTER" : `VSL${i}`,
  })),
  tipo_de_venda: [
    { value: "1", label: "CALLCENTER" },
    { value: "2", label: "FRONT" },
    { value: "3", label: "BACKREDIRECT" },
    { value: "4", label: "UPSELL" },
    { value: "5", label: "DOWNSELL" },
  ],
  kit: Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  })),
  preco: [
    5, 19, 29, 39, 49, 59, 69, 79, 89, 99, 109, 119, 129, 132, 147, 149, 177,
    198, 234, 261, 294, 351,
  ].map((price) => ({
    value: String(price),
    label: String(price),
  })),
};
