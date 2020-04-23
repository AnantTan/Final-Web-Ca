function draw_table()
{
	$("#results").empty();
	$.getJSONuncached = function (url)
	{
		return $.ajax(
		{
			url: url,
			type: 'GET',
			cache: false,
			success: function (html)
			{
				$("#results").append(html);
				select_row();
				resetFields();				
			}
		});
	};
	$.getJSONuncached("/get/html")
};

function select_row()
{
	$("#menuTable tbody tr[id]").click(function ()
	{
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
		var section = $(this).prevAll("tr").children("td[colspan='3']").length - 1;
		var entree = $(this).attr("id") - 1;
		var _id=$(this).find("input[type=checkbox]:checked").data("id");
		delete_row(section, entree,_id);
	})
};

function delete_row(sec, ent,_id)
{
	$("#delete").click(function ()
	{
		$.ajax(
		{
			url: "/post/delete",
			type: "POST",
			data:
			{
				section: sec,
				entree: ent,
				_id:_id
			},
			cache: false,
			success: setTimeout(draw_table, 1000)
		})
	})
};

$(document).ready(function ()
{
	draw_table();
});

function resetFields(){
	$("select[name=sec_n]").val(0);
	$("input[name=item]").val("");
	$("input[name=price]").val("");
	$("input[name=_id]").val("");
	$("button[type=submit]").text("Add Item");
}

$("#results").on("change","#menuTable input[type=checkbox]",function(){
	if($(this).is(":checked")){
		var sec_n=$(this).parents("tr").data("sec"),
			id=$(this).data("id"),
			item=$(this).parent().next().text().trim(),
			price=$(this).parent().next().next().text().trim();

		$("select[name=sec_n]").val(sec_n);
		$("input[name=item]").val(item);
		$("input[name=price]").val(price);
		$("input[name=_id]").val(id);
		$("button[type=submit]").text("Update Item");
	}else{
		if($("#menuTable").find("input[type=checkbox]:checked").length==0){
			resetFields();
		}
	}
})