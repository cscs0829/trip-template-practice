import re

# Read the file content
with open('/Users/parkchangseon/Desktop/트립페이지 홈페이지/trippage/board.html', 'r') as f:
    content = f.read()

# 1. Remove the renderBoardPagination function definition
# This regex looks for the function definition and captures everything inside it.
# It's important to be precise to avoid deleting too much or too little.
pattern_remove_function = r"function renderBoardPagination\(current, total\) {\n    [\s\S]*?\n}"
content = re.sub(pattern_remove_function, '', content)

# 2. Replace the call to renderBoardPagination
pattern_replace_call = r"renderBoardPagination\(data.page, data.totalPages\);"
content = re.sub(pattern_replace_call, "renderPagination('board-pagination', data.page, data.totalPages, loadPosts);", content)

# 3. Replace hardcoded pagination HTML with an empty ul
pattern_replace_html = r"<ul class=\"pagination\" id=\"board-pagination\">[\s\S]*?</ul>"
replacement_html = "<ul class=\"pagination\" id=\"board-pagination\">
				<!-- 페이지네이션이 동적으로 로드됩니다 -->
			</ul>"
content = re.sub(pattern_replace_html, replacement_html, content)

# 4. Add the pagination.js script inclusion
# Find the last script tag before the closing </body>
pattern_add_script = r"(<script type=\"text/javascript\" src=\"js/swipe.js\"></script>)"
content = re.sub(pattern_add_script, "<script type=\"text/javascript\" src=\"js/pagination.js\"></script>\n\1", content)


# Write the modified content back to the file
with open('/Users/parkchangseon/Desktop/트립페이지 홈페이지/trippage/board.html', 'w') as f:
    f.write(content)