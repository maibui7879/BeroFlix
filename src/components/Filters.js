import React from "react";

const Filters = ({ filters, setFilters, categories, countries, showFilters }) => {
  return (
    showFilters && (
      <div className="grid grid-cols-3 gap-4 mt-4 w-2/3 transition-all duration-500 ease-in-out transform origin-top opacity-100 scale-y-100">
        <select
          className="p-2 border border-gray-700 rounded bg-gray-800"
          onChange={(e) => setFilters({ ...filters, sort_lang: e.target.value || null })}
        >
          <option value="">Ngôn ngữ</option>
          <option value="vietsub">Vietsub</option>
          <option value="thuyet-minh">Thuyết Minh</option>
          <option value="long-tieng">Lồng Tiếng</option>
        </select>

        <select
  className="p-2 border border-gray-700 rounded bg-gray-800"
  onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
>
  <option value="">Thể loại</option>
  {categories.map((cat, index) => (
    <option key={cat.id || index} value={cat.slug}>
      {cat.name}
    </option>
  ))}
</select>

<select
  className="p-2 border border-gray-700 rounded bg-gray-800"
  onChange={(e) => setFilters({ ...filters, country: e.target.value || null })}
>
  <option value="">Quốc gia</option>
  {countries.map((country, index) => (
    <option key={country.id || index} value={country.slug}>
      {country.name}
    </option>
  ))}
</select>

      </div>
    )
  );
};

export default Filters;
