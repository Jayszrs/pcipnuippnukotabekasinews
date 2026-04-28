import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { articles, categories } from "@/data/news";

const Category = () => {
  const { slug } = useParams();
  const category = categories.find(
    (c) => c.toLowerCase().replace(/\s+/g, "-") === slug
  );
  const items = category ? articles.filter((a) => a.category === category) : [];

  useEffect(() => {
    document.title = `${category ?? "Kategori"} — IPNU IPPNU Bekasi`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [category]);

  return (
    <Layout>
      <div className="bg-secondary border-b border-border">
        <div className="container-news py-10 lg:py-14">
          <span className="section-label">Kategori</span>
          <h1 className="mt-2 font-display font-black text-4xl lg:text-5xl">
            {category ?? "Kategori tidak ditemukan"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} artikel dalam kategori ini
          </p>
        </div>
      </div>

      <section className="container-news py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12">
          <div>
            {items.length === 0 ? (
              <p className="text-muted-foreground">Belum ada artikel.</p>
            ) : (
              <div className="space-y-8 divide-y divide-border">
                {items.map((a) => (
                  <div key={a.id} className="pt-8 first:pt-0">
                    <NewsCard article={a} variant="horizontal" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </section>
    </Layout>
  );
};

export default Category;
