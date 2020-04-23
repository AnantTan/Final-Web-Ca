<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
                <table id="menuTable" class="indent">
                    <thead>
                        <tr>
                            <th colspan="3">Tesco Mini stock</th>
                        </tr>
                        <tr>
                            <th>Select</th>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="/tescostock/section">
                            <tr class='section' data-sec='{@secid}'>
                                <td colspan="3">
                                    <xsl:value-of select="@name" />
                                </td>
                            </tr>
                            <xsl:for-each select="entree">
                            <tr id="{position()}" data-sec='{sec_n}'>
                                <xsl:attribute name="vegetarian">
                                    <xsl:value-of select="boolean(./@vegetarian)" />
                                </xsl:attribute>
                                <td align="center">
                                    <input name="item0" data-id="{_id}" type="checkbox" />
                                </td>
                                <td>
                                    <xsl:value-of select="item" />
                                </td>
                                <td align="right">
                                    <xsl:value-of select="price" />
                                </td>
                            </tr>
                            </xsl:for-each>
                        </xsl:for-each>
                    </tbody>
                </table><br/>
    </xsl:template>
</xsl:stylesheet>