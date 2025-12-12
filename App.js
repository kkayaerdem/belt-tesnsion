import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";

/* ---------- SELECT ---------- */
const Select = ({ label, options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>{label}</Text>

      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          padding: 12,
          backgroundColor: "white",
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text>{selected}</Text>
      </TouchableOpacity>

      {open && (
        <View
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            marginTop: 4,
          }}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

/* ---------- KATALOG ---------- */
const CATALOG = {
  AT5: { mkg: 0.0033, widths: { 10: 516, 16: 826, 25: 1290, 32: 1651, 50: 2580, 75: 3870, 100: 5160 } },
  ATL5:{ mkg: 0.0028, widths: { 10: 516, 16: 826, 25: 1290, 32: 1651, 50: 2580, 75: 3870, 100: 5160, 150: 7740 }},
  AT10:{ mkg: 0.0057, widths: { 16: 1651, 25: 2580, 32: 3302, 50: 5160, 75: 7740, 100: 10320, 150: 15480 }},
  ATL10:{ mkg: 0.0067, widths: { 16: 1651, 25: 2580, 32: 3302, 50: 5160, 75: 7740, 100: 10320, 150: 15480 }},
  AT20:{ mkg: 0.0097, widths: { 25: 5430, 32: 6950, 50: 10860, 75: 16290, 100: 21720, 150: 32580 }},
  ATL20:{ mkg: 0.0107, widths: { 32: 6950, 50: 10860, 75: 16290, 100: 21720, 150: 32580 }},
};

/* ---------- HESAP ---------- */
const calculateF = (mkg, w, Lm, f) =>
  4 * (mkg * (w )) * (Lm ** 2) * (f ** 2);

const adjustNormalF = (F, role) =>
  role === "Avare" ? (F * 23) / 80 : F * 0.5;

const getStatus = (F, nF) => {
  if (F > nF) return { text: "Fazla Gergin", color: "#ff3b30", emoji: "❌", advice: "Kayışı biraz gevşetin." };
  if (F < 0.8 * nF) return { text: "Gevşek", color: "#ffcc00", emoji: "⚠️", advice: "Kayışı biraz sıkın." };
  return { text: "Uygun", color: "#34c759", emoji: "✅", advice: "Ayar ideal durumda." };
};

/* ---------- APP ---------- */
export default function App() {
  const [belt, setBelt] = useState("AT5");
  const [width, setWidth] = useState("10");
  const [Lmm, setLmm] = useState("1000"); // mm
  const [freq, setFreq] = useState("10");
  const [role, setRole] = useState("Avare");
  const [result, setResult] = useState(null);

  const widthList = Object.keys(CATALOG[belt].widths);
  useEffect(() => setWidth(widthList[0]), [belt]);

  const onCalculate = () => {
    const Lm = parseFloat(Lmm) / 1000; // mm → m
    const w = parseFloat(width);
    const f = parseFloat(freq);

    const mkg = CATALOG[belt].mkg;
    const F = calculateF(mkg, w, Lm, f);
    const nF = adjustNormalF(CATALOG[belt].widths[w], role);
    const diff = ((F - nF) / nF) * 100;
    const status = getStatus(F, nF);

    setResult({ belt, w, Lm, f, F, nF, diff, status });
  };

  return (
    <ScrollView
      style={{ padding: 20, backgroundColor: "#f2f2f2" }}
      contentContainerStyle={{ paddingBottom: 60 }}   // 🔥 ALT OKUNURLUK GARANTİ
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
             Coiltech Kayış Gergi Hesabı
      </Text>

      <Select label="Kayış Türü (Sadece çelik tel)" options={Object.keys(CATALOG)} selected={belt} onSelect={setBelt} />
      <Select label="Kayış Eni (mm)" options={widthList} selected={width} onSelect={setWidth} />

      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        Serbest Boy
      </Text>
      <TextInput
        value={Lmm}
        onChangeText={setLmm}
        keyboardType="numeric"
        placeholder="Serbest Salınım Boyu (mm)"
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 14,
        }}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        Frekans (Hz)
      </Text>
      <TextInput
        value={freq}
        onChangeText={setFreq}
        keyboardType="numeric"
         placeholder="Salınım Merkezinden Ölçün"
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 14,
        }}
      />

      <Select label="Kasnaklar" options={["Avare", "Tahrik"]} selected={role} onSelect={setRole} />

      {/* HESAPLA */}
      <TouchableOpacity
        onPress={onCalculate}
        style={{
          backgroundColor: "#0a84ff",
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
          HESAPLA
        </Text>
      </TouchableOpacity>

      {/* SONUÇ */}
      {result && (
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 8,
            borderWidth: 3,
            borderColor: result.status.color,
          }}
        >
          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              {result.status.emoji} DURUM:{" "}
              <Text style={{ color: result.status.color }}>
                {result.status.text}
              </Text>
            </Text>

            <Text>Kayış: {result.belt}</Text>
            <Text>En: {result.w} mm</Text>
            <Text>Boy: {(result.Lm * 1000).toFixed(0)} mm</Text>
            <Text>Frekans: {result.f} Hz</Text>

            <Text style={{ marginTop: 8 }}>F: {result.F.toFixed(2)} N</Text>
            <Text>Referans F: {result.nF.toFixed(2)} N</Text>
            <Text>Fark: {result.diff.toFixed(1)} %</Text>

            <Text style={{ marginTop: 12, fontStyle: "italic" }}>
              {result.status.advice}
            </Text>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}
