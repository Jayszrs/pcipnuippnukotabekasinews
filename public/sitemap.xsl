<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html lang="id">
      <head>
        <title>XML Sitemap — PC IPNU IPPNU Kota Bekasi</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f9;
            color: #334155;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            padding: 35px;
            border-radius: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header {
            border-bottom: 3px solid #03441b;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          h1 {
            color: #03441b;
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          p.desc {
            color: #64748b;
            font-size: 13px;
            margin-top: 8px;
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background-color: #03441b;
            color: #ffffff;
            text-align: left;
            padding: 14px 18px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          th:first-child {
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
          }
          th:last-child {
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
          }
          td {
            padding: 14px 18px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
            font-weight: 500;
          }
          tr:hover td {
            background-color: #f0fdf4;
          }
          a {
            color: #03441b;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            color: #d4af37;
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .badge-high {
            background-color: #fef3c7;
            color: #d97706;
            border: 1px solid #fde68a;
          }
          .badge-normal {
            background-color: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Peta Situs XML</h1>
            <p class="desc">
              Dokumen ini dihasilkan secara otomatis untuk membantu mesin pencari seperti Google atau Bing merayap dan mengindeks seluruh halaman di website portal berita <strong>PC IPNU IPPNU Kota Bekasi</strong> secara optimal.
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rute URL Halaman</th>
                <th>Prioritas Index</th>
                <th>Frekuensi Update</th>
                <th>Pembaruan Terakhir</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <a href="{s:loc}" target="_blank">
                      <xsl:value-of select="s:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="s:priority = '1.0'">
                        <span class="badge badge-high">Utama (1.0)</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="badge badge-normal">Internal (<xsl:value-of select="s:priority"/>)</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td style="text-transform: capitalize;">
                    <xsl:value-of select="s:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="s:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>