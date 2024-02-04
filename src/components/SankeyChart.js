import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';

const color = d3.scaleOrdinal(d3.schemeCategory10);

const SankeyChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
      console.log(data)

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      // Set up the sankey generator
      const sankeyGenerator = sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .nodeAlign(sankeyLeft)
          .extent([[1, 1], [width - 1, height - 5]]);

      const uniqueNodes = Array.from(new Map(data.nodes.map(node => [node.name, node])).values());

      console.log(data)

      const cleanLinks = data.links.map(link => ({
        source: uniqueNodes.findIndex(n => n.name === data.nodes[link.source].name),
        target: uniqueNodes.findIndex(n => n.name === data.nodes[link.target].name),
        value: Number(link.value)
      }));

      const sortedNodes = [...uniqueNodes].sort((a, b) => {
        const categoryA = a.category || '';
        const categoryB = b.category || '';
        return categoryA.localeCompare(categoryB);
      });
  
      const updatedLinks = cleanLinks.map(link => ({
        ...link,
        source: sortedNodes.findIndex(node => node.name === data.nodes[link.source].name),
        target: sortedNodes.findIndex(node => node.name === data.nodes[link.target].name)
      }));

      console.log(sortedNodes, updatedLinks)

      // Compute the sankey diagram
      const { nodes, links } = sankeyGenerator({
          nodes: sortedNodes.map(d => Object.assign({}, d)),
          links: updatedLinks.map(d => Object.assign({}, d))
      });

      //links
      svg.append("g")
      .selectAll("path")
      .data(links)
      .enter().append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", d => color(d.source.index)) // Use the source node's index for color
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("stroke-opacity", 0.5);

      //nodes
      svg.append("g")
      .selectAll("rect")
      .data(nodes)
      .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", sankeyGenerator.nodeWidth())
        .attr("fill", (d, i) => color(i));

      //titles for nodes
      svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .selectAll(".nodeLabel")
        .data(nodes)
        .enter().append("text")
          .attr("class", "nodeLabel")
          .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6) // Position based on which side of the chart the node is on
          .attr("y", d => (d.y1 + d.y0) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
          .attr("fill", "white")
          .style("font-weight", "bold")
          .text(d => `${d.name} (${d.value})`);

  }, [data]); // Redraw chart if data changes

  return <svg ref={svgRef} width={800} height={600}></svg>;
};

export default SankeyChart;